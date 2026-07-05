import { CTA } from "@/components/CTA";
import { PortfolioCard } from "@/components/PortfolioCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SEO } from "@/components/SEO";

const projects = [
  {
    title: "Carbon Monarch",
    image: "/portfolio/carbon-monarch-thumbnail.png",
    url: "https://official-carbon-monarch.vercel.app/",
    category: "Demo ecommerce website",
    description:
      "A demo brand website showing product displays, premium styling, and a clean path from browsing to enquiry or purchase.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Responsive Design", "Brand Website"],
  },
  {
    title: "VertexLab",
    image: "/portfolio/vertexlab-thumbnail.png",
    url: "https://vertex-lab-lyart.vercel.app/",
    category: "Demo ecommerce website",
    description:
      "A demo product website showing how categories, product details, and customer enquiries can be presented clearly on every device.",
    technologies: ["Next.js", "Product Website", "Responsive Design", "Demo Store"],
  },
];

export default function Portfolio() {
  return (
    <>
      <SEO
        title="Portfolio | APEX WEB"
        description="View APEX WEB demo websites that show modern responsive designs for local business websites, product sites, and ecommerce examples."
      />
      <section className="section pt-36">
        <div className="container">
          <SectionHeader
            eyebrow="Demo websites"
            title="Live demo websites you can click through."
            description="These are demo projects, not client case studies. They show the style, responsiveness, and level of polish APEX WEB can bring to a business website."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <PortfolioCard key={project.title} {...project} delay={index * 0.06} />
            ))}
          </div>
        </div>
      </section>
      <CTA
        title="Seen enough to start your own website?"
        description="Request a quote and APEX WEB will suggest a realistic build package for your business, then explain optional hosting and management separately."
      />
    </>
  );
}
