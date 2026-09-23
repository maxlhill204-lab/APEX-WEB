import type { Lead } from "./lead";
import { packages, carePlans, site } from "../site.config";

export function enquiryDraft(lead: Lead) {
  const rows = [
    ["Name", lead.name], ["Email", lead.email], ["Phone", lead.phone],
    ["Preferred contact", lead.contact], ["Business", lead.business],
    ["Industry", lead.industry], ["Website", lead.website], ["Social", lead.social],
    ["About the business", lead.description],
    ["Package", packages.find(p => p.id === lead.package)?.name || lead.package],
    ["Care", carePlans.find(p => p.id === lead.care)?.name || lead.care],
    ["Billing", lead.billing], ["Features", lead.features.join(", ")],
    ["Style", lead.style], ["Timing", lead.timeframe], ["Pages", lead.pages],
    ["Notes", lead.notes], ["Contact consent", lead.consent ? "Confirmed" : "Not yet confirmed"],
  ];
  const subject = `Website enquiry — ${lead.business.replace(/[\r\n]/g, " ")}`;
  const body = rows.map(([label, value]) => `${label}: ${value || "Not specified"}`).join("\n\n");
  return { subject, body, href: `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
