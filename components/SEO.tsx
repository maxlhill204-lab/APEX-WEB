import Head from "next/head";

type SEOProps = {
  title: string;
  description: string;
};

export function SEO({ title, description }: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="theme-color" content="#0A0A0A" />
    </Head>
  );
}
