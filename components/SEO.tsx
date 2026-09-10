import Head from "next/head";
import { useRouter } from "next/router";
import { site } from "@/site.config";
export function SEO({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { asPath } = useRouter();
  const canonical = site.url + asPath.split(/[?#]/)[0];
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${site.url}/social-card.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="theme-color" content="#0b0b0b" />
      <link rel="icon" href="/favicon.svg" />
    </Head>
  );
}
