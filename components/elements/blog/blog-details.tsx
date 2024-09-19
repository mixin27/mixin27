import { Blog } from "@/contentlayer/generated";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import React from "react";
import { FaTag, FaEye, FaClock, FaCalendarAlt } from "react-icons/fa";

type Props = {
  slug: string;
  blog: Blog;
};

const BlogDetails = ({ blog }: Props) => {
  return (
    <div className="container mx-auto flex flex-wrap items-center justify-around gap-2">
      <div className="flex items-center gap-4 text-white/60">
        <FaCalendarAlt className="text-accent" />
        <time className="my-3">
          {format(parseISO(blog.publishedAt), "LLLL d, yyyy")}
        </time>
      </div>

      <div className="flex items-center gap-4 text-white/60">
        <FaEye className="text-accent" />
        <span className="my-3">10 views</span>
      </div>

      <div className="flex items-center gap-4 text-white/60">
        <FaClock className="text-accent" />
        <div className="my-3">{blog.readingTime.text}</div>
      </div>

      <div className="flex items-center gap-4 text-white/60">
        <FaTag className="text-accent" />
        {blog.tags && (
          <Link href={`/categories/${blog.tags[0]}`} className="my-3">
            #{blog.tags[0]}
          </Link>
        )}
      </div>
    </div>
  );

  // return (
  //   <div className="container mx-auto">
  //     <div className="px-10 bg-accent dark:bg-accentDark text-primary py-2 flex items-center justify-around flex-wrap text-xl font-medium rounded-lg">
  //       <time className="my-3">
  //         {format(parseISO(blog.publishedAt), "LLLL d, yyyy")}
  //       </time>
  //       <span className="my-3">10 views</span>
  //       <div className="my-3">{blog.readingTime.text}</div>
  //       {blog.tags && (
  //         <Link href={`/categories/${blog.tags[0]}`} className="my-3">
  //           #{blog.tags[0]}
  //         </Link>
  //       )}
  //     </div>
  //   </div>
  // );
};

export default BlogDetails;
