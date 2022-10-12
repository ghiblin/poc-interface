import NextHead from "next/head";
import { useRouter } from "next/router";
import { MetaProps } from "../types/layout";

export const WEBSITE_HOST_URL =
  process.env.WEBSITE_HOST_URL || "http://localhost:3000";

type HeadProps = {
  customMeta?: MetaProps;
};

export default function Head({ customMeta }: HeadProps): JSX.Element {
  const router = useRouter();
  const meta: MetaProps = {
    title: "Education DAO",
    description: "Decentralized Autonomous Organization for Education",
    type: "website",
    ...customMeta,
  };
  return (
    <NextHead>
      <title>{meta.title}</title>
      <meta property="og:url" content={`${WEBSITE_HOST_URL}${router.asPath}`} />
      <link rel="canonical" href={`${WEBSITE_HOST_URL}${router.asPath}`} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="Education DAO" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@huntarosan" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {/* <meta name="twitter:image" content={meta.image} /> */}
      {meta.date && (
        <meta property="article:published_time" content={meta.date} />
      )}
    </NextHead>
  );
}
