import { allProjects } from "@/.contentlayer/generated";
import { siteMetadada } from "@/lib/siteMetadata";
import { Metadata } from "next";
import { parseISO } from "date-fns";
import WorkList from "./_components/work-list";

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
  const projects = allProjects.sort((a, b) => {
    return parseISO(b.endDate).getTime() - parseISO(a.endDate).getTime();
  });

  return <WorkList projects={projects} />;
};

export default Page;
