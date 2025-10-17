import { allContents } from "@/.contentlayer/generated";
import { siteMetadada } from "@/lib/siteMetadata";
import { Metadata } from "next";
import AppsPages from "./apps-pages";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blogs",
    description: "All available apps related pages.",
    openGraph: {
      title: "Apps",
      description: "All available apps related pages.",
      url: `${siteMetadada.siteUrl}/apps`,
      siteName: siteMetadada.title,
      locale: siteMetadada.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Apps",
      description: "All available apps related pages.",
    },
  };
}

const Page = () => {
  return <AppsPages apps={allContents} />;
};

export default Page;
