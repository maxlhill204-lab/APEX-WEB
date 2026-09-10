import type { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "node:crypto";
import { parseLead } from "@/lib/lead";
import { sendLeadEmails, emailContent } from "@/lib/lead-email";
import { site } from "@/site.config";
export const config = {
  api: { bodyParser: { sizeLimit: "24kb" } },
  maxDuration: 30,
};
const requests = new Map<string, { count: number; reset: number }>();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ message: "Use the quote form to send an enquiry." });
  }
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (
    origin &&
    origin !== site.url &&
    origin !== `https://${host}` &&
    !(process.env.NODE_ENV === "development" && origin === `http://${host}`)
  )
    return res
      .status(403)
      .json({
        message: "Please submit your enquiry from the APEXWEB website.",
      });
  if (!req.headers["content-type"]?.includes("application/json"))
    return res
      .status(415)
      .json({ message: "Please use the website quote form." });
  const ip = String(
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown",
  )
    .split(",")[0]
    .trim();
  const now = Date.now();
  for (const [key, value] of requests)
    if (value.reset < now) requests.delete(key);
  const key = createHash("sha256").update(ip).digest("hex");
  const rate = requests.get(key) || { count: 0, reset: now + 600000 };
  if (rate.count >= 8) {
    res.setHeader("Retry-After", Math.ceil((rate.reset - now) / 1000));
    return res
      .status(429)
      .json({
        message:
          "Please wait a few minutes before trying again, or email us directly.",
      });
  }
  rate.count++;
  requests.set(key, rate);
  if (req.body?.companyFax)
    return res
      .status(400)
      .json({
        message: "We couldn’t accept that request. Please email us directly.",
      });
  const parsed = parseLead(req.body);
  if (!parsed.lead)
    return res
      .status(400)
      .json({
        message: "Please check the details in your enquiry.",
        errors: parsed.errors,
      });
  const lead = parsed.lead;
  // Hash the full validated payload: same retry is the same lead, edited content is a new lead.
  const reference =
    "AW-" +
    createHash("sha256")
      .update(JSON.stringify(lead))
      .digest("hex")
      .slice(0, 24);
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  let stored = false;
  let storeError = "";
  if (
    project &&
    apiKey &&
    project !== "[SENSITIVE]" &&
    apiKey !== "[SENSITIVE]"
  ) {
    // Preserve the existing create-only Firestore schema and security rules.
    // The complete structured quote is kept in the message field for future CRM import.
    const values: Record<string, unknown> = {
      name: lead.name,
      business: lead.business,
      email: lead.email,
      phone: lead.phone,
      message:
        emailContent(lead, reference).businessText +
        "\n\nContact consent: confirmed\n\nStructured enquiry:\n" +
        JSON.stringify(lead),
      source: lead.source,
      createdAt: new Date().toISOString(),
    };
    const fields = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [
        k,
        k === "createdAt"
          ? { timestampValue: v }
          : Array.isArray(v)
            ? { arrayValue: { values: v.map((x) => ({ stringValue: x })) } }
            : typeof v === "boolean"
              ? { booleanValue: v }
              : { stringValue: String(v) },
      ]),
    );
    try {
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents/enquiries?documentId=${reference}&key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields }),
          signal: AbortSignal.timeout(9000),
        },
      );
      stored = response.ok || response.status === 409;
      if (!stored) {
        storeError = `firestore_${response.status}`;
        const reason = await response.json().catch(() => ({}));
        console.error("quote_storage_rejected", {
          code: reason.error?.status,
          reason: reason.error?.message,
          details: reason.error?.details
            ?.map((d: { reason?: string }) => d.reason)
            .filter(Boolean),
        });
      }
    } catch {
      storeError = "firestore_connection";
    }
  }
  let email = { businessSent: false, confirmationSent: false };
  if (process.env.RESEND_API_KEY) {
    email = await sendLeadEmails(lead, reference);
  }
  if (!stored && !email.businessSent) {
    console.error("quote_delivery_failed", {
      reference,
      storeError: storeError || "not_configured",
      emailConfigured: !!process.env.RESEND_API_KEY,
    });
    return res
      .status(503)
      .json({
        message:
          "We couldn’t receive your enquiry just now. Your answers are still here. Please try again or email us directly.",
      });
  }
  console.info("quote_received", {
    reference,
    stored,
    businessEmailSent: email.businessSent,
    confirmationSent: email.confirmationSent,
  });
  return res
    .status(200)
    .json({ ok: true, reference, confirmationSent: email.confirmationSent });
}
