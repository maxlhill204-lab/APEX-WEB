import {
  packages,
  carePlans,
  featureOptions,
  styleOptions,
} from "../site.config";
export type Lead = {
  package: string;
  care: string;
  billing: string;
  business: string;
  industry: string;
  website: string;
  social: string;
  description: string;
  features: string[];
  style: string;
  timeframe: string;
  pages: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
  contact: string;
  consent: boolean;
  companyFax: string;
  requestId: string;
  submittedAt: string;
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
};
export const emptyLead: Lead = {
  package: "unsure",
  care: "unsure",
  billing: "unsure",
  business: "",
  industry: "",
  website: "",
  social: "",
  description: "",
  features: [],
  style: "Not sure",
  timeframe: "Flexible",
  pages: "Not sure",
  notes: "",
  name: "",
  email: "",
  phone: "",
  contact: "Email",
  consent: false,
  companyFax: "",
  requestId: "",
  submittedAt: "",
  source: "website",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  referrer: "",
};
export const packageIds = [...packages.map((p) => p.id), "custom", "unsure"];
export const timeframes = [
  "Flexible",
  "As soon as practical",
  "Within 1 month",
  "1–3 months",
  "3+ months",
];
export const pageCounts = [
  "Not sure",
  "1–3",
  "4–5",
  "6–8",
  "9+",
  "6–10",
  "10+",
];
export function validUrl(value: string) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return (
      ["http:", "https:"].includes(u.protocol) && !!u.hostname.includes(".")
    );
  } catch {
    return false;
  }
}
export function validateStep(lead: Lead, step: number): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0 && !packageIds.includes(lead.package))
    e.package = "Choose a package or ask us to help you decide.";
  if (step === 1) {
    if (!lead.business.trim()) e.business = "Enter your business name.";
    if (lead.description.trim().length < 10)
      e.description =
        "Tell us a little about your business (at least 10 characters).";
    if (!validUrl(lead.website))
      e.website = "Use a full website address, starting with https://.";
    if (!validUrl(lead.social))
      e.social = "Use a full social profile link, starting with https://.";
  }
  if (step === 3) {
    if (!lead.name.trim()) e.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))
      e.email = "Enter a valid email address, such as you@business.com.";
    if (lead.phone && !/^[+()\d\s.-]{7,25}$/.test(lead.phone))
      e.phone = "Enter a valid phone number.";
    if (lead.contact === "Phone" && !lead.phone.trim())
      e.phone = "Add a phone number or choose email as your preference.";
  }
  if (step === 4 && !lead.consent)
    e.consent = "Please confirm that we may contact you about this enquiry.";
  return e;
}
export function parseLead(input: unknown): {
  lead?: Lead;
  errors: Record<string, string>;
} {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { errors: { form: "Please check your enquiry." } };
  const body = input as Record<string, unknown>;
  const lead = { ...emptyLead };
  const errors: Record<string, string> = {};
  for (const key of Object.keys(emptyLead) as (keyof Lead)[]) {
    if (key === "features" || key === "consent") continue;
    if (key === "billing" && body[key] === undefined) continue;
    if (typeof body[key] !== "string") {
      errors[key] = "Please check this field.";
      continue;
    }
    const max = ["description", "notes"].includes(key)
      ? 3000
      : ["website", "social", "referrer"].includes(key)
        ? 1000
        : 250;
    if ((body[key] as string).length > max)
      errors[key] = `Please use ${max} characters or fewer.`;
    (lead[key] as string) = (body[key] as string).trim();
  }
  lead.consent = body.consent === true;
  if (
    !Array.isArray(body.features) ||
    body.features.length > featureOptions.length ||
    body.features.some(
      (f) => typeof f !== "string" || !featureOptions.includes(f),
    )
  )
    errors.features = "Choose from the listed features.";
  else lead.features = [...new Set(body.features)] as string[];
  if (![...carePlans.map((p) => p.id), "none", "unsure"].includes(lead.care))
    errors.care = "Choose a listed care option.";
  if (!["monthly", "yearly", "unsure"].includes(lead.billing))
    errors.billing = "Choose a listed billing period.";
  if (!styleOptions.includes(lead.style))
    errors.style = "Choose a listed design style.";
  if (!timeframes.includes(lead.timeframe))
    errors.timeframe = "Choose a listed timeframe.";
  if (!pageCounts.includes(lead.pages))
    errors.pages = "Choose a listed page count.";
  if (!["Email", "Phone"].includes(lead.contact))
    errors.contact = "Choose email or phone.";
  if (!/^[0-9a-f-]{36}$/i.test(lead.requestId))
    errors.requestId = "Please refresh the form and try again.";
  if (!Number.isFinite(Date.parse(lead.submittedAt)))
    errors.submittedAt = "Please refresh the form and try again.";
  for (let step = 0; step < 5; step++)
    Object.assign(errors, validateStep(lead, step));
  return Object.keys(errors).length ? { errors } : { lead, errors };
}
