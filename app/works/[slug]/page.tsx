import { allProjects } from "@/.contentlayer/generated";
import WorkDetails from "./work-details";
import { Metadata } from "next";
import { siteMetadada } from "@/lib/siteMetadata";

export async function generateStaticParams() {
  return allProjects.map((project) => project._raw.flattenedPath);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = allProjects.find(
    (project) => project._raw.flattenedPath === params.slug
  );
  if (!project) return {};

  const publishedAt = new Date(project.updatedAt).toISOString();
  const modifiedAt = new Date(project.updatedAt).toISOString();

  let imageList: string[] = [siteMetadada.socialBanner];
  if (project.image) {
    imageList =
      typeof project.image.filePath === "string"
        ? [
            `${siteMetadada.siteUrl}${project.image.filePath.replace(
              "../public",
              ""
            )}`,
          ]
        : [siteMetadada.socialBanner];
  }

  const ogImages = imageList.map((img) => {
    return { url: img.includes("http") ? img : siteMetadada.siteUrl + img };
  });

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${siteMetadada.siteUrl}${project.url}`,
      siteName: siteMetadada.title,
      locale: siteMetadada.locale,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: ogImages,
      authors: siteMetadada.author,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: ogImages,
    },
  };
}

const WorkDetail = ({ params }: { params: { slug: string } }) => {
  const project = allProjects.find(
    (project) =>
      project._raw.flattenedPath.replace("projects/", "") === params.slug
  );

  if (!project) return <>No found</>;

  return <WorkDetails slug={params.slug} project={project} />;
};

export default WorkDetail;
