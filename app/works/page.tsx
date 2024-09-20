import { allProjects } from "@/.contentlayer/generated";
import Works from "./works";
import { siteMetadada } from "@/lib/siteMetadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Works",
    description: "All completed and ongoing works.",
    openGraph: {
      title: "Works",
      description: "All completed and ongoing works.",
      url: `${siteMetadada.siteUrl}/works`,
      siteName: siteMetadada.title,
      locale: siteMetadada.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Works",
      description: "All completed and ongoing works.",
    },
  };
}

const Page = () => {
  return <Works projects={allProjects} />;
};

export default Page;
