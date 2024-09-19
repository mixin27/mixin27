import { Blog } from "@/contentlayer/generated";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import React from "react";

type Props = {
  slug: string;
  blog: Blog;
};

const BlogDetails = ({ blog }: Props) => {
  return (
    <div className="px-14">
      <div className="px-10 bg-accent dark:bg-accentDark text-primary py-2 flex items-center justify-around flex-wrap text-xl font-medium rounded-lg">
        <time className="my-3">
          {format(parseISO(blog.publishedAt), "LLLL d, yyyy")}
        </time>
        <span className="my-3">10 views</span>
        <div className="my-3">{blog.readingTime.text}</div>
        {blog.tags && (
          <Link href={`/categories/${blog.tags[0]}`} className="my-3">
            #{blog.tags[0]}
          </Link>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
