import React from "react";
import Services from "./services";
import { siteMetadada } from "@/lib/siteMetadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Services",
    description: "All available service.",
    openGraph: {
      title: "Services",
      description: "All available service.",
      url: `${siteMetadada.siteUrl}/services`,
      siteName: siteMetadada.title,
      locale: siteMetadada.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Services",
      description: "All available service.",
    },
  };
}
const Page = () => {
  return <Services />;
};

export default Page;
