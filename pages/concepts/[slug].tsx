import Image from "next/image";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import { ArrowUpRight } from "lucide-react";
import { SEO } from "@/components/SEO";
const concepts = [
  {
    slug: "carbon-monarch",
    title: "Carbon Monarch",
    image: "carbon-monarch-thumbnail.png",
    url: "https://official-carbon-monarch.vercel.app/",
    description:
      "A product and lifestyle demo exploring bold imagery, focused product presentation and a clear route through the collection.",
  },
  {
    slug: "vertexlab",
    title: "VertexLab",
    image: "vertexlab-thumbnail.png",
    url: "https://vertex-lab-lyart.vercel.app/",
    description:
      "A technology retail demo exploring product discovery, clear categories and a consistent visual identity.",
  },
];
export default function Concept({
  concept,
}: {
  concept: (typeof concepts)[number];
}) {
  return (
    <>
      <SEO
        title={`${concept.title} — APEXWEB demo build`}
        description={concept.description}
      />
      <section className="container concept-page">
        <Link href="/#work" className="text-link">
          ← Back to example work
        </Link>
        <p className="eyebrow" style={{ marginTop: 35 }}>
          DEMO BUILD · DESIGN EXPLORATION
        </p>
        <h1>{concept.title}</h1>
        <p>
          {concept.description} This is a demonstration, not a client case study
          or a statement of commercial results.
        </p>
        <Image
          className="concept-full-image"
          src={`/portfolio/${concept.image}`}
          alt={`${concept.title} website design preview`}
          width={1864}
          height={1049}
          sizes="90vw"
          priority
        />
        <div className="concept-actions">
          <a
            className="button button-outline"
            href={concept.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the live demo <ArrowUpRight size={18} />
          </a>
          <Link className="button" href={`/quote?source=demo-${concept.slug}`}>
            Talk about your website <ArrowUpRight size={18} />
          </Link>
        </div>
        <p className="fine-print">
          The live demo opens separately. Demo products and checkout flows are
          for exploration.
        </p>
      </section>
    </>
  );
}
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: concepts.map((c) => ({ params: { slug: c.slug } })),
  fallback: false,
});
export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: { concept: concepts.find((c) => c.slug === params?.slug) },
});
