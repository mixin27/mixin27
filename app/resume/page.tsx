import React from "react";
import Resume from "./resume";
import { siteMetadada } from "@/lib/siteMetadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Resume",
    description: "Updated resume or cv.",
    openGraph: {
      title: "Resume",
      description: "Updated resume or cv.",
      url: `${siteMetadada.siteUrl}/resume`,
      siteName: siteMetadada.title,
      locale: siteMetadada.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Works",
      description: "Updated resume or cv.",
    },
  };
}

const Page = () => {
  return <Resume />;
};

export default Page;
