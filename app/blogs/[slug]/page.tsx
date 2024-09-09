import React from "react";
import BlogDetail from "./detail";
import { Blog } from "@/interfaces/blog";
import { getBlogBySlugWithMarkdown, getBlogList } from "@/lib/blog";

async function getBlog(slug: string): Promise<Blog> {
  const project = await getBlogBySlugWithMarkdown(slug);
  return project;
}

export async function generateStaticParams() {
  const blogs = getBlogList();

  return blogs.map((project: Blog) => ({
    slug: project.slug,
    project,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlog(params.slug);

  return {
    title: blog.title,
  };
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const blog = await getBlog(params.slug);

  return (
    <>
      <BlogDetail blog={blog} />
    </>
  );
};

export default Page;
