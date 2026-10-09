import Link from "next/link";
import { SEO } from "@/components/SEO";
import { site } from "@/site.config";
export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy notice — APEXWEB"
        description="How APEXWEB uses information you share when requesting a website quote."
      />
      <section className="container prose-page">
        <p className="eyebrow">YOUR INFORMATION</p>
        <h1>A straightforward privacy notice.</h1>
        <p>
          When you request a quote, you share contact details, information about
          your business and your website requirements with APEXWEB.
        </p>
        <h2>Why we collect it</h2>
        <p>
          We use this information to review your project, prepare a quote,
          respond to you and keep a record of our conversation. Submitting a
          quote does not subscribe you to marketing emails.
        </p>
        <h2>How it is handled</h2>
        <p>
          Our website and enquiry processing use Vercel and Google Firebase. If
          email notifications are enabled, Resend processes the details needed
          to send them. These providers may process information outside
          Australia.
        </p>
        <p>
          We keep enquiry records for handling your request and related business
          administration. You can contact us to request access, corrections or
          deletion. We will explain if a record must be retained for an existing
          project or other applicable obligation.
        </p>
        <h2>Website and campaign information</h2>
        <p>
          We use Vercel Web Analytics to understand page visits and interactions.
          It uses a privacy-focused, cookie-free measurement system rather than advertising cookies.
          You can exclude this browser using our <Link href="/analytics-preferences">analytics preferences</Link>.
          We filter query strings from analytics URLs and do not include your enquiry answers in analytics events.
        </p>
        <p>
          If you agree to a paid project or care plan, Stripe processes payments
          on its hosted payment pages. Stripe handles your card details; we
          receive billing records and payment or subscription status needed to
          administer your service. Payment details are not entered into the
          enquiry form.
        </p>
        <p>
          Your enquiry may include the campaign source or referring website that
          brought you here. We use this to understand which enquiries come from
          which campaigns. We do not add advertising trackers or collect payment
          information through this form.
        </p>
        <h2>Questions or requests</h2>
        <p>
          Email <a href={`mailto:${site.email}`}>{site.email}</a> about your
          information or this notice. This notice may be updated as our services
          change.
        </p>
        <Link className="button button-outline" href="/quote">
          Back to your quote
        </Link>
      </section>
    </>
  );
}
