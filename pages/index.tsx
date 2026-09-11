import { SEO } from "@/components/SEO";
import { ImmersiveShowcase } from "@/components/ImmersiveShowcase";
import { RocketExperience } from "@/components/RocketExperience";
import { site } from "@/site.config";
export default function Home() {
  return (
    <>
      <SEO
        title="APEXWEB — Custom websites. Out of this world."
        description="Custom website design from $300 AUD. Choose a simple site, interactive business website or cinematic 3D experience. Optional monthly or annual hosting."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: site.name,
            url: site.url,
            email: site.email,
            sameAs: [site.instagram, site.facebook],
            description: "Custom website design for businesses.",
          }),
        }}
      />
      <ImmersiveShowcase />
      <section
        id="screen-handoff"
        className="screen-handoff"
        data-deployed="true"
      >
        <div className="handoff-surface">
          <div className="handoff-content">
            <span className="eyebrow">APEXWEB / PRODUCTION</span>
            <h2>
              <span className="before-publish">Ready to publish.</span>
              <span className="after-publish">Your website is live.</span>
            </h2>
            <p>
              <span className="before-publish">
                Design approved. Mobile tested. Domain connected.
              </span>
              <span className="after-publish">
                Secure. Connected. Open for business.
              </span>
            </p>
            <span className="published-pill">
              <span className="before-publish">Publish site</span>
              <span className="after-publish">✓ Published</span>
            </span>
            <div className="deploy-checks">
              ✓ HTTPS active <span>✓ Contact form connected</span> ✓ Online
            </div>
            <a href="#start" className="handoff-next">
              Now, let’s make it yours ↓
            </a>
          </div>
          <span className="surface-cursor" aria-hidden="true">
            ➤
          </span>
          <div className="surface-glare" aria-hidden="true" />
        </div>
      </section>
      <RocketExperience />
    </>
  );
}
