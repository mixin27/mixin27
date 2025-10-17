import { allContents } from "@/.contentlayer/generated";
import { Metadata } from "next";
import { siteMetadada } from "@/lib/siteMetadata";
import AppContentDetails from "./details";

export async function generateStaticParams() {
  return allContents.map((content) => content._raw.flattenedPath);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const appContent = allContents.find(
    (content) =>
      content._raw.flattenedPath.replace("contents/", "") === params.slug
  );
  if (!appContent) return {};

  const publishedAt = new Date(appContent.updatedAt).toISOString();
  const modifiedAt = new Date(appContent.updatedAt).toISOString();

  return {
    title: appContent.title,
    description: appContent.description,
    openGraph: {
      title: appContent.title,
      description: appContent.description,
      url: `${siteMetadada.siteUrl}${appContent.url}`,
      siteName: siteMetadada.title,
      locale: siteMetadada.locale,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      authors: siteMetadada.author,
    },
    twitter: {
      card: "summary_large_image",
      title: appContent.title,
      description: appContent.description,
    },
  };
}

const Page = ({ params }: { params: { slug: string } }) => {
  const content = allContents.find(
    (content) =>
      content._raw.flattenedPath.replace("contents/", "") === params.slug
  );

  if (!content) return <>No found</>;

  return <AppContentDetails slug={params.slug} appContent={content} />;
};

export default Page;
