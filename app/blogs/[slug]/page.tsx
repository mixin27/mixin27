import { allBlogs } from "@/.contentlayer/generated";
import Details from "./details";
import { siteMetadada } from "@/lib/siteMetadata";
import { Metadata } from "next";

export async function generateStaticParams() {
  return allBlogs.map((blog) => blog._raw.flattenedPath);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = allBlogs.find((blog) => blog._raw.flattenedPath === params.slug);
  if (!blog) return {};

  const publishedAt = new Date(blog.publishedAt).toISOString();
  const modifiedAt = new Date(blog.updatedAt || blog.publishedAt).toISOString();

  let imageList: string[] = [siteMetadada.socialBanner];
  if (blog.image) {
    imageList =
      typeof blog.image.filePath === "string"
        ? [
            `${siteMetadada.siteUrl}${blog.image.filePath.replace(
              "../public",
              ""
            )}`,
          ]
        : [siteMetadada.socialBanner];
  }

  const ogImages = imageList.map((img) => {
    return { url: img.includes("http") ? img : siteMetadada.siteUrl + img };
  });

  const authors = blog.author ? [blog.author] : siteMetadada.author;

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `${siteMetadada.siteUrl}${blog.url}`,
      siteName: siteMetadada.title,
      locale: siteMetadada.locale,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadada.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: ogImages,
    },
  };
}

const Page = ({ params }: { params: { slug: string } }) => {
  const blog = allBlogs.find(
    (blog) => blog._raw.flattenedPath.replace("blogs/", "") === params.slug
  );

  if (!blog) return <>No found</>;
  return <Details blog={blog} slug={params.slug} />;
};

export default Page;
