import type { Lead } from "./lead";
import { site, packages, carePlans } from "../site.config";
const escape = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function emailContent(lead: Lead, reference: string) {
  const rows = [
    ["Reference", reference],
    [
      "Package",
      packages.find((p) => p.id === lead.package)?.name || lead.package,
    ],
    ["Care", carePlans.find((p) => p.id === lead.care)?.name || lead.care],
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Preferred contact", lead.contact],
    ["Business", lead.business],
    ["Industry", lead.industry],
    ["Website", lead.website],
    ["Social", lead.social],
    ["Business description", lead.description],
    ["Features", lead.features.join(", ")],
    ["Style", lead.style],
    ["Timeframe", lead.timeframe],
    ["Pages", lead.pages],
    ["Notes", lead.notes],
    ["Submitted", lead.submittedAt],
    ["Source", lead.source],
    ["UTM source", lead.utm_source],
    ["UTM medium", lead.utm_medium],
    ["UTM campaign", lead.utm_campaign],
    ["Referrer", lead.referrer],
  ];
  const shell = (title: string, body: string) =>
    `<!doctype html><html lang="en"><body style="margin:0;background:#f3f2ee;font-family:Arial,sans-serif;color:#222"><div style="max-width:620px;margin:32px auto;background:white;padding:36px"><p style="font-size:20px;letter-spacing:2px;font-weight:bold">APEXWEB</p><hr style="border:0;border-top:1px solid #ddd;margin:25px 0"><h1 style="font-size:28px;line-height:1.2">${title}</h1>${body}<p style="font-size:12px;color:#666;margin-top:35px">APEXWEB · ${escape(site.email)}<br>${escape(reference)}</p></div></body></html>`;
  const businessText = rows
    .map(([k, v]) => `${k}: ${v || "Not specified"}`)
    .join("\n");
  const businessHtml = shell(
    "A new website enquiry",
    `<table style="border-collapse:collapse;width:100%">${rows.map(([k, v]) => `<tr><th style="padding:12px 8px;border-bottom:1px solid #eee;text-align:left;vertical-align:top;font-size:13px;width:130px">${escape(k)}</th><td style="padding:12px 8px;border-bottom:1px solid #eee;white-space:pre-wrap;word-break:break-word;font-size:14px">${escape(v || "Not specified")}</td></tr>`).join("")}</table>`,
  );
  const confirmationText = `Hi ${lead.name},\n\nThanks for telling APEXWEB about ${lead.business}. Your website enquiry has been received.\n\nWe’ll review your requirements and contact you about the right approach and quote. We confirm the scope, final price and timing before work begins, and start only once we both agree.\n\nThis is an enquiry, not a purchase. No payment or commitment has been made.\n\nReference: ${reference}\nQuestions? Reply to this email.\n\nAPEXWEB`;
  const confirmationHtml = shell(
    "Your next step is underway.",
    `<p>Hi ${escape(lead.name)},</p><p style="line-height:1.7">Thanks for telling us about ${escape(lead.business)}. Your website enquiry has been received.</p><ol style="line-height:1.9"><li>We review your requirements.</li><li>We contact you to discuss the approach and quote.</li><li>We agree on scope, price and timing before work begins.</li></ol><p style="line-height:1.7">This is an enquiry, not a purchase. No payment or commitment has been made.</p><p>Questions? Simply reply to this email.</p>`,
  );
  return { businessText, businessHtml, confirmationText, confirmationHtml };
}
export async function sendLeadEmails(lead: Lead, reference: string) {
  const content = emailContent(lead, reference);
  const from = process.env.EMAIL_FROM || site.emailFrom;
  async function send(
    suffix: string,
    to: string,
    subject: string,
    html: string,
    text: string,
    reply_to: string,
  ) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `${reference}-${suffix}`,
        },
        body: JSON.stringify({ from, to: [to], subject, html, text, reply_to }),
        signal: AbortSignal.timeout(7000),
      });
      if (!r.ok)
        console.error("quote_email_failed", {
          reference,
          kind: suffix,
          status: r.status,
        });
      return r.ok;
    } catch {
      console.error("quote_email_failed", {
        reference,
        kind: suffix,
        status: "timeout_or_network",
      });
      return false;
    }
  }
  const businessSent = await send(
    "business",
    site.email,
    `Website enquiry — ${lead.business.replace(/[\r\n]/g, " ")}`,
    content.businessHtml,
    content.businessText,
    lead.email,
  );
  // Only confirm a receipt after the business email has been accepted.
  const confirmationSent = businessSent
    ? await send(
        "customer",
        lead.email,
        "Your website enquiry — APEXWEB",
        content.confirmationHtml,
        content.confirmationText,
        site.email,
      )
    : false;
  return { businessSent, confirmationSent };
}
