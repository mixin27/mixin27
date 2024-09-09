import { Blog } from "@/interfaces/blog";
import { NextPage } from "next";
import React from "react";

type Props = {
  blog: Blog;
};

const BlogDetail: NextPage<Props> = ({ blog }) => {
  return (
    <div className="container mx-auto">
      <article className="prose prose-invert lg:prose-lg markdown-image-50 markdown-code order-2 xl:order-none">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </div>
  );
};

export default BlogDetail;
