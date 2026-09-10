import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  packages,
  carePlans,
  featureOptions,
  styleOptions,
  site,
} from "@/site.config";
import {
  emptyLead,
  validateStep,
  timeframes,
  pageCounts,
  type Lead,
} from "@/lib/lead";
import { track } from "@/lib/analytics";
const steps = [
  "Your package",
  "Your business",
  "Your website",
  "Your details",
  "Review & send",
];
const descriptions = [
  "Choose a starting point. We’ll confirm the right fit together.",
  "A little context helps us plan a website that fits.",
  "Select what matters to you. It’s fine to leave the details to us.",
  "Where should we send your quote and next steps?",
  "Check the details. This is an enquiry, not a purchase.",
];
type Props = {
  initialPackage?: string;
  initialCare?: string;
  attribution: Partial<Lead>;
};
export function QuoteWizard({
  initialPackage = "unsure",
  initialCare = "unsure",
  attribution,
}: Props) {
  const [lead, setLead] = useState<Lead>({
    ...emptyLead,
    package: initialPackage,
    care: initialCare,
    ...attribution,
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "error" | "success"
  >("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  const lock = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const identity = useRef({ requestId: "", submittedAt: "" });
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      track("quote_started", { package: initialPackage });
    }
  }, [initialPackage]);
  function update<K extends keyof Lead>(key: K, value: Lead[K]) {
    setLead((l) => ({ ...l, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
    identity.current = { requestId: "", submittedAt: "" };
  }
  function move(next: number) {
    setStep(next);
    setErrors({});
    setStatus("idle");
    setTimeout(() => {
      heading.current?.focus();
      heading.current?.scrollIntoView({ block: "start", behavior: "auto" });
    }, 0);
  }
  function errorFocus(e: Record<string, string>) {
    setErrors(e);
    setTimeout(() => {
      form.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)
        ?.focus();
    }, 0);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    const e = validateStep(lead, step);
    if (Object.keys(e).length) {
      errorFocus(e);
      return;
    }
    if (step < 4) {
      move(step + 1);
      return;
    }
    lock.current = true;
    setStatus("sending");
    setMessage("");
    if (!identity.current.requestId)
      identity.current = {
        requestId: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
      };
    let savedAttribution: Partial<Lead> = {};
    try {
      savedAttribution = JSON.parse(
        sessionStorage.getItem("apexweb-attribution") || "{}",
      );
    } catch {}
    const payload = {
      ...lead,
      ...savedAttribution,
      ...identity.current,
      referrer: document.referrer ? new URL(document.referrer).origin : "",
    };
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(
          result.message ||
            "We couldn’t send your enquiry just now. Your answers are still here. Please try again, or email us.",
        );
      }
      setReference(result.reference);
      setConfirmation(result.confirmationSent === true);
      setStatus("success");
      track("quote_completed", { package: lead.package });
      setTimeout(() => heading.current?.focus(), 0);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.name === "TimeoutError"
          ? "The connection took too long. Your answers are safe here. Retry to check your request without creating a duplicate."
          : error instanceof Error
            ? error.message
            : "Your enquiry could not be sent. Please try again.",
      );
    } finally {
      lock.current = false;
    }
  }
  const field = (
    name:
      | "business"
      | "industry"
      | "website"
      | "social"
      | "description"
      | "notes"
      | "name"
      | "email"
      | "phone",
    label: string,
    type = "text",
    required = false,
  ) => (
    <label className="field" key={name} htmlFor={name}>
      {label}
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={lead[name]}
          required={required}
          maxLength={3000}
          onChange={(e) => update(name, e.target.value)}
          aria-label={label}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
      ) : (
        <input
          aria-label={label}
          id={name}
          name={name}
          value={lead[name]}
          type={type}
          required={required}
          maxLength={type === "url" ? 1000 : 250}
          autoComplete={
            name === "name"
              ? "name"
              : name === "email"
                ? "email"
                : name === "phone"
                  ? "tel"
                  : name === "business"
                    ? "organization"
                    : "off"
          }
          onChange={(e) => update(name, e.target.value)}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          placeholder={type === "url" ? "https://" : undefined}
        />
      )}{" "}
      {errors[name] && (
        <span className="error-text" id={`${name}-error`}>
          {errors[name]}
        </span>
      )}
    </label>
  );
  const select = (
    name: "care" | "timeframe" | "pages" | "contact",
    label: string,
    options: { value: string; label: string }[],
  ) => (
    <label className="field" htmlFor={name}>
      {label}
      <select
        name={name}
        id={name}
        value={lead[name]}
        onChange={(e) => update(name, e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
  const selected = packages.find((p) => p.id === lead.package);
  const packageName =
    selected?.name ||
    (lead.package === "custom" ? "Custom project" : "Help me decide");
  const review = (title: string, index: number, values: [string, string][]) => (
    <div className="review-group">
      <h3>
        {title}
        <button
          type="button"
          onClick={() => move(index)}
          aria-label={`Edit ${title.toLowerCase()}`}
        >
          Edit
        </button>
      </h3>
      <dl>
        {values.map(([label, value]) => (
          <div className="review-row" key={label}>
            <dt>{label}</dt>
            <dd>{value || "Not specified"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
  if (status === "success")
    return (
      <div className="wizard" aria-live="polite">
        <div className="success-icon">
          <Check size={30} />
        </div>
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h2 ref={heading} tabIndex={-1}>
          Your enquiry is received.
        </h2>
        <p className="step-description">
          Thanks, {lead.name}. Your project details have been accepted. You
          haven’t purchased anything.
        </p>
        <ol className="success-list">
          <li>We review your business and website requirements.</li>
          <li>We contact you to discuss the right approach and quote.</li>
          <li>We confirm the scope, final price and timing together.</li>
          <li>Work begins once we both agree.</li>
        </ol>
        {confirmation && (
          <p className="fine-print">
            A confirmation email has been sent to {lead.email}. Check your spam
            folder if it doesn’t arrive.
          </p>
        )}
        <p className="success-ref">Your reference: {reference}</p>
        <Link className="button button-outline" href="/">
          Back to APEXWEB <ArrowRight size={17} />
        </Link>
      </div>
    );
  return (
    <form
      ref={form}
      className="wizard"
      noValidate
      onSubmit={submit}
      aria-busy={status === "sending"}
    >
      <div className="wizard-progress">
        <span>Step {step + 1} of 5</span>
        <span>{steps[step]}</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Quote progress"
        aria-valuenow={step + 1}
        aria-valuemin={0}
        aria-valuemax={5}
      >
        <span style={{ width: `${(step + 1) * 20}%` }} />
      </div>
      <h2 ref={heading} tabIndex={-1}>
        {steps[step]}
      </h2>
      <p className="step-description">{descriptions[step]}</p>
      <fieldset disabled={status === "sending"}>
        <legend className="sr-only">{steps[step]}</legend>
        {step === 0 && (
          <>
            <div className="choice-list">
              {packages.map((p) => (
                <label className="choice" key={p.id}>
                  <input
                    type="radio"
                    name="package"
                    value={p.id}
                    checked={lead.package === p.id}
                    onChange={() => {
                      update("package", p.id);
                      track("package_selected", { package: p.id });
                    }}
                  />
                  <span className="choice-text">
                    <strong>{p.name}</strong>
                    <small>
                      {p.pages}
                      {p.recommended ? " · Recommended for services" : ""}
                    </small>
                  </span>
                  <span className="choice-price">From ${p.price}</span>
                </label>
              ))}
              {[
                [
                  "custom",
                  "Custom project",
                  "Something larger or a little different",
                ],
                [
                  "unsure",
                  "Help me decide",
                  "We’ll recommend a sensible starting point",
                ],
              ].map(([id, name, desc]) => (
                <label className="choice" key={id}>
                  <input
                    type="radio"
                    name="package"
                    checked={lead.package === id}
                    onChange={() => update("package", id)}
                  />
                  <span className="choice-text">
                    <strong>{name}</strong>
                    <small>{desc}</small>
                  </span>
                </label>
              ))}
            </div>
            <p className="fine-print">
              AUD, one-time build. Final scope and price confirmed in your
              quote. Hosting and external services are separate.
            </p>
          </>
        )}
        {step === 1 && (
          <>
            {field("business", "Business name *", "text", true)}
            {field("industry", "Industry (optional)")}
            <div className="form-grid">
              {field("website", "Current website (optional)", "url")}
              {field("social", "Instagram / social link (optional)", "url")}
            </div>
            {field(
              "description",
              "What does your business do? *",
              "textarea",
              true,
            )}
          </>
        )}
        {step === 2 && (
          <>
            <fieldset>
              <legend>
                What would you like your website to do? (optional)
              </legend>
              <div className="choice-grid">
                {featureOptions.map((f) => (
                  <label className="choice" key={f}>
                    <input
                      type="checkbox"
                      name="features"
                      checked={lead.features.includes(f)}
                      onChange={(e) =>
                        update(
                          "features",
                          e.target.checked
                            ? [...lead.features, f]
                            : lead.features.filter((x) => x !== f),
                        )
                      }
                    />
                    {f}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Which style feels like you? (optional)</legend>
              <div className="choice-grid">
                {styleOptions.map((s) => (
                  <label className="choice" key={s}>
                    <input
                      type="radio"
                      name="style"
                      checked={lead.style === s}
                      onChange={() => update("style", s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="form-grid">
              {select(
                "timeframe",
                "Preferred timing",
                timeframes.map((x) => ({ value: x, label: x })),
              )}
              {select(
                "pages",
                "Approximate pages",
                pageCounts.map((x) => ({ value: x, label: x })),
              )}
            </div>
            {select("care", "Optional ongoing care", [
              { value: "unsure", label: "Discuss this with me" },
              { value: "none", label: "Build only for now" },
              ...carePlans.map((p) => ({
                value: p.id,
                label: `${p.name} — $${p.price}/month`,
              })),
            ])}
            {field("notes", "Anything else? (optional)", "textarea")}
          </>
        )}
        {step === 3 && (
          <>
            {field("name", "Your name *", "text", true)}
            {field("email", "Email address *", "email", true)}
            <div className="form-grid">
              {field("phone", "Phone (optional unless preferred)", "tel")}
              {select("contact", "Preferred contact method", [
                { value: "Email", label: "Email" },
                { value: "Phone", label: "Phone" },
              ])}
            </div>
            <p className="fine-print">
              We use your details to respond to your project enquiry. No
              newsletter sign-up.
            </p>
          </>
        )}
        {step === 4 && (
          <>
            <div className="selected-summary">
              <strong>{packageName}</strong>
              <span>
                {selected
                  ? `From $${selected.price} AUD`
                  : "Individually quoted"}
              </span>
            </div>
            {review("Package", 0, [["Build", packageName]])}
            {review("Business", 1, [
              ["Business", lead.business],
              ["Industry", lead.industry],
              ["Website", lead.website],
              ["Social", lead.social],
              ["About", lead.description],
            ])}
            {review("Website", 2, [
              ["Features", lead.features.join(", ") || "Please recommend"],
              ["Style", lead.style],
              ["Timing", lead.timeframe],
              ["Pages", lead.pages],
              [
                "Care",
                carePlans.find((p) => p.id === lead.care)?.name ||
                  (lead.care === "none" ? "Build only" : "Discuss with me"),
              ],
              ["Notes", lead.notes],
            ])}
            {review("Contact", 3, [
              ["Name", lead.name],
              ["Email", lead.email],
              ["Phone", lead.phone],
              ["Preference", lead.contact],
            ])}
            <label className="consent">
              <input
                type="checkbox"
                name="consent"
                checked={lead.consent}
                onChange={(e) => update("consent", e.target.checked)}
                aria-describedby={errors.consent ? "consent-error" : undefined}
              />
              <span>
                I agree that APEXWEB may contact me about this enquiry, as
                explained in the{" "}
                <Link href="/privacy" target="_blank">
                  privacy notice (opens a new tab)
                </Link>
                . This request is not a purchase.
              </span>
            </label>
            {errors.consent && (
              <p className="error-text" id="consent-error">
                {errors.consent}
              </p>
            )}
          </>
        )}
        <div className="honeypot" aria-hidden="true">
          <label>
            Company fax
            <input
              name="companyFax"
              tabIndex={-1}
              autoComplete="off"
              value={lead.companyFax}
              onChange={(e) => update("companyFax", e.target.value)}
            />
          </label>
        </div>
      </fieldset>
      {status === "error" && (
        <div className="error-banner" role="alert">
          {message}
          <br />
          <a href={`mailto:${site.email}`}>Email {site.email}</a>
        </div>
      )}
      <div className="wizard-actions">
        {step > 0 ? (
          <button
            type="button"
            className="back-button"
            disabled={status === "sending"}
            onClick={() => move(step - 1)}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        ) : (
          <Link href="/#packages" className="back-button">
            <ArrowLeft size={16} />
            Packages
          </Link>
        )}
        <button
          type="submit"
          className="button"
          disabled={status === "sending"}
        >
          {status === "sending"
            ? "Sending your enquiry…"
            : step === 4
              ? "Send quote request"
              : "Continue"}
          <ArrowRight size={17} />
        </button>
      </div>
      <p className="wizard-note">
        No commitment. We confirm your project and final price before work
        begins.
      </p>
    </form>
  );
}
