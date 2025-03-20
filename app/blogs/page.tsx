import { allBlogs } from "@/.contentlayer/generated";
import Blogs from "./blogs";
import { siteMetadada } from "@/lib/siteMetadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blogs",
    description: "All available content blogs.",
    openGraph: {
      title: "Blogs",
      description: "All available content blogs.",
      url: `${siteMetadada.siteUrl}/blogs`,
      siteName: siteMetadada.title,
      locale: siteMetadada.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blogs",
      description: "All available content blogs.",
    },
  };
}

const Page = () => {
  return <Blogs blogs={allBlogs} />;
};

export default Page;
