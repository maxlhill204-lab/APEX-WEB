import Link from "next/link";
import Image from "next/image";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Clock, Mail, PackageCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { FacebookIcon } from "@/components/FacebookIcon";
import { InstagramIcon } from "@/components/InstagramIcon";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SEO } from "@/components/SEO";
import { getFirestoreDb } from "@/lib/firebase";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const enquiry = {
      name: String(formData.get("name") || "").trim(),
      business: String(formData.get("business") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      packageInterest: String(formData.get("packageInterest") || "").trim(),
      managementInterest: String(formData.get("managementInterest") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      source: "apex-web-contact-page",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(getFirestoreDb(), "enquiries"), enquiry);
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your enquiry.",
      );
    }
  }

  return (
    <>
      <SEO
        title="Contact | APEX WEB"
        description="Request a free quote for a custom website build with optional monthly hosting and management."
      />
      <section className="section pt-36">
        <div className="container">
          <SectionHeader
            eyebrow="Contact"
            title="Request a free website quote."
            description="Send an enquiry with your email address, business details, and the package you are considering. APEX WEB will reply directly by email."
          />
          <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
            <Reveal>
              <form className="luxury-border rounded-2xl p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-white">
                    Name
                    <input
                      className="min-h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-gold/60"
                      name="name"
                      placeholder="Your name"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-white">
                    Business Name
                    <input
                      className="min-h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-gold/60"
                      name="business"
                      placeholder="Your business"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-white">
                    Email
                    <input
                      className="min-h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-gold/60"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-white">
                    Phone Optional
                    <input
                      className="min-h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-gold/60"
                      name="phone"
                      type="tel"
                      placeholder="0400 000 000"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-white">
                    Build Package
                    <select
                      className="min-h-12 rounded-xl border border-white/10 bg-surface2 px-4 text-white outline-none transition focus:border-gold/60"
                      name="packageInterest"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose one
                      </option>
                      <option>Starter Site from $300</option>
                      <option>Local Business Site from $550</option>
                      <option>Growth Site from $850</option>
                      <option>Not sure yet</option>
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-white">
                    Monthly Management
                    <select
                      className="min-h-12 rounded-xl border border-white/10 bg-surface2 px-4 text-white outline-none transition focus:border-gold/60"
                      name="managementInterest"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose one
                      </option>
                      <option>Hosted from $39/mo</option>
                      <option>Managed from $79/mo</option>
                      <option>Priority from $149/mo</option>
                      <option>Build only for now</option>
                      <option>Not sure yet</option>
                    </select>
                  </label>
                </div>
                <label className="mt-5 grid gap-2 text-sm font-bold text-white">
                  Project Description
                  <textarea
                    className="min-h-40 resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-gold/60"
                    name="message"
                    placeholder="Tell us what your business does, what pages you need, what customers should do next, and when you would like to launch."
                    required
                  />
                </label>
                {status === "success" ? (
                  <p className="mt-5 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm font-semibold text-green-200">
                    Thanks. Your enquiry has been sent. APEX WEB will reply to the email address you provided.
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">
                    {errorMessage}
                  </p>
                ) : null}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="premium-button-shine group inline-flex min-h-12 items-center justify-center rounded-full border border-gold/70 bg-gold px-7 text-sm font-bold text-black shadow-[0_14px_45px_rgba(212,175,55,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f0d56c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? "Saving Enquiry..." : "Get A Free Quote"}
                  </button>
                  <p className="text-sm leading-6 text-neutral-500">
                    Your reply will be sent to the email address above.
                  </p>
                </div>
              </form>
            </Reveal>

            <Reveal delay={0.1}>
              <aside className="luxury-border rounded-2xl p-7">
                <div className="relative mb-7 h-24 w-24 overflow-hidden rounded-full border border-gold/35 bg-black shadow-[0_0_32px_rgba(212,175,55,0.18)]">
                  <Image
                    src="/apex-web-profile.png"
                    alt="APEX WEB profile logo"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <p className="eyebrow">Why contact us?</p>
                <h2 className="mt-4 text-3xl font-black leading-tight text-white">
                  Get a clear next step before anything is built.
                </h2>
                <p className="mt-4 leading-7 text-neutral-400">
                  APEX WEB will review your goals, recommend a sensible build
                  package, and explain any optional monthly hosting or management
                  separately by email.
                </p>
                <div className="mt-8 grid gap-4">
                  <div className="flex gap-3 text-neutral-300">
                    <Clock className="mt-1 h-5 w-5 flex-none text-gold" />
                    <span>Submit the form, then receive the reply by email.</span>
                  </div>
                  <Link
                    href="mailto:apexweb.au@gmail.com"
                    className="flex gap-3 text-neutral-300 transition hover:text-gold"
                  >
                    <Mail className="mt-1 h-5 w-5 flex-none text-gold" />
                    <span>apexweb.au@gmail.com</span>
                  </Link>
                  <div className="flex gap-3 text-neutral-300">
                    <PackageCheck className="mt-1 h-5 w-5 flex-none text-gold" />
                    <span>Build packages start from $300. Monthly plans start from $39/mo.</span>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <Link
                    href="https://www.instagram.com/apexweb.au/"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition hover:border-gold/50 hover:text-gold"
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://www.facebook.com/profile.php?id=61591306250659"
                    aria-label="Facebook"
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition hover:border-gold/50 hover:text-gold"
                  >
                    <FacebookIcon className="h-5 w-5" />
                  </Link>
                </div>
                <div className="mt-8">
                  <ButtonLink
                    href="/services"
                    variant="secondary"
                  >
                    View Packages
                  </ButtonLink>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
