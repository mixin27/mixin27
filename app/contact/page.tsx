import React from "react";
import Contact from "./contact";
import { siteMetadada } from "@/lib/siteMetadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description:
      "I'm available to provide support and discuss your project needs.",
    openGraph: {
      title: "Contact",
      description:
        "I'm available to provide support and discuss your project needs.",
      url: `${siteMetadada.siteUrl}/contact`,
      siteName: siteMetadada.title,
      locale: siteMetadada.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact",
      description:
        "I'm available to provide support and discuss your project needs.",
    },
  };
}

const Page = () => {
  return <Contact />;
};

export default Page;
