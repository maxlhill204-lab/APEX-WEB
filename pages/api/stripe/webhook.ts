import type { NextApiRequest, NextApiResponse } from "next";
import { verifyBillingEvent, notifyBillingEvent } from "@/lib/billing-events";

export const config = { api: { bodyParser: false }, maxDuration: 30 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_TEST_WEBHOOK_SECRET)
    return res.status(503).json({ message: "Billing is not configured." });
  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string")
    return res.status(400).json({ message: "Missing signature." });
  const chunks: Buffer[] = [];
  let size = 0;
  try {
    for await (const chunk of req) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.length;
      if (size > 1024 * 1024) return res.status(413).json({ message: "Request too large." });
      chunks.push(buffer);
    }
  } catch { return res.status(400).json({ message: "Invalid request." }); }
  let event;
  try { event = verifyBillingEvent(Buffer.concat(chunks), signature); }
  catch { return res.status(400).json({ message: "Invalid signature." }); }
  const accepted = await notifyBillingEvent(event);
  console.info("billing_event", { id: event.id, type: event.type, livemode: event.livemode, accepted });
  // Returning a failure keeps Stripe's retry mechanism active until notification
  // acceptance; the handler never modifies subscription or payment state.
  return res.status(accepted ? 200 : 503).json({ received: accepted });
}
