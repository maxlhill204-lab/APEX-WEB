import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import "@/styles/globals.css";
const inter = Inter({ subsets: ["latin"], display: "optional" });
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const data: Record<string, string> = {};
    for (const k of ["source", "utm_source", "utm_medium", "utm_campaign"]) {
      const v = q.get(k);
      if (v) data[k] = v.slice(0, 250);
    }
    if (Object.keys(data).length) {
      try {
        sessionStorage.setItem("apexweb-attribution", JSON.stringify(data));
      } catch {}
    }
  }, [router.asPath]);
  return (
    <div className={inter.className}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
