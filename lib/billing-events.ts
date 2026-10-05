import Stripe from "stripe";
import { site } from "../site.config";

const lifecycleEvents = new Set([
  "customer.subscription.created", "customer.subscription.updated",
  "customer.subscription.deleted", "invoice.paid", "invoice.payment_failed",
  "invoice.payment_action_required",
]);

export function verifyBillingEvent(body: Buffer, signature: string): Stripe.Event {
  const secrets = [
    { value: process.env.STRIPE_WEBHOOK_SECRET, live: true },
    { value: process.env.STRIPE_TEST_WEBHOOK_SECRET, live: false },
  ].filter(s => s.value);
  if (!secrets.length) throw new Error("Billing webhook is not configured.");
  for (const secret of secrets) {
    try {
      const event = Stripe.webhooks.constructEvent(body, signature, secret.value!);
      if (event.livemode === secret.live) return event;
    } catch { /* Try the other explicitly configured environment. */ }
  }
  throw new Error("Invalid Stripe signature or environment.");
}

export async function notifyBillingEvent(event: Stripe.Event): Promise<boolean> {
  if (!lifecycleEvents.has(event.type)) return true;
  const object = event.data.object as unknown as {
    id: string; metadata?: Record<string, string>; status?: string;
    currency?: string; amount_paid?: number; amount_due?: number;
    customer?: string; cancel_at_period_end?: boolean;
    parent?: { subscription_details?: { metadata?: Record<string, string> } };
  };
  // Manual service fulfilment has no application account/entitlement database.
  // Explicit catalogue metadata is its ownership boundary. Invoice events inherit
  // subscription metadata through Stripe's versioned invoice parent graph.
  const metadata = object.parent?.subscription_details?.metadata || object.metadata;
  if (metadata?.business !== "apexweb.au") return true;
  if (!process.env.RESEND_API_KEY) return false;
  const text = [
    "APEXWEB billing notification — verify the current object in Stripe before acting.",
    `Environment: ${event.livemode ? "LIVE" : "SANDBOX — no real payment"}`,
    `Event: ${event.type}`, `Event ID: ${event.id}`, `Object: ${object.id}`,
    `Customer: ${object.customer || "See Stripe"}`, `Status: ${object.status || "See Stripe"}`,
    `Cancel at period end: ${object.cancel_at_period_end ?? "Not applicable"}`,
    `Amount paid (minor units): ${object.amount_paid ?? "Not applicable"}`,
    `Amount due (minor units): ${object.amount_due ?? "Not applicable"}`,
    `Currency: ${object.currency || "See Stripe"}`,
    "Events can arrive out of order or be replayed. This email does not automatically start, stop or change service.",
  ].join("\n");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `apexweb-billing-${event.id}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || site.emailFrom, to: [site.email],
        subject: `${event.livemode ? "APEXWEB" : "APEXWEB SANDBOX"} billing — ${event.type}`,
        text,
      }),
      signal: AbortSignal.timeout(7000),
    });
    return response.ok;
  } catch { return false; }
}
