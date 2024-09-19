"use client";

import Image from "next/image";
import { slug } from "github-slugger";
import { allBlogs } from "@/.contentlayer/generated";
import { motion } from "framer-motion";

// components
import BlogRenderMdx from "@/components/elements/blog/blog-render-mdx";
import BlogDetails from "@/components/elements/blog/blog-details";
import Tag from "@/components/elements/tag";

const Page = ({ params }: { params: { slug: string } }) => {
  const blog = allBlogs.find((item) => {
    console.log("path", item._raw.flattenedPath);
    console.log("slug", params.slug);
    return item._raw.flattenedPath.replace("blogs/", "") === params.slug;
  });

  if (!blog) return <>No found</>;

  return (
    <article>
      <div className="mb-8 text-center relative w-full h-[70vh] bg-primary">
        <div className="w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {blog.tags && (
            <Tag
              name={blog.tags[0]}
              link={`/categories/${slug(blog.tags[0])}`}
              className="px-6 text-sm py-2"
            />
          )}

          <h1 className="inline-block mt-6 font-semibold capitalize text-white text-5xl leading-normal relative w-5/6">
            {blog.title}
          </h1>
        </div>

        <div className="absolute top-0 right-0 bottom-0 left-0 h-full bg-dark/60" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 2, duration: 0.4, ease: "easeIn" },
          }}
          className="aspect-square w-full h-full"
        >
          <Image
            src={blog.image.filePath.replace("../public", "")}
            placeholder="blur"
            blurDataURL={blog.image.blurhashDataUrl}
            alt={blog.title}
            width={blog.image.width}
            height={blog.image.height}
            className="aspect-square w-full h-full object-center object-cover"
          />
        </motion.div>
      </div>

      <BlogDetails slug={params.slug} blog={blog} />

      <div className="grid grid-cols-12 gap-16 mt-8 px-10">
        <div className="col-span-4">
          <details
            className="border-[1px] border-solid border-dark dark:border-light text-white rounded-lg p-4 sticky top-6 max-h-[90vh] overflow-hidden overflow-y-auto"
            open
          >
            <summary className="text-lg font-semibold capitalize cursor-pointer">
              Table Of Content
            </summary>
            <ul className="mt-4 font-inter text-base">
              {blog.toc.map(
                (heading: { level: string; text: string; slug: string }) => {
                  return (
                    <li key={`#${heading.slug}`} className="py-1">
                      <a
                        href={`#${heading.slug}`}
                        data-level={heading.level}
                        className="data-[level=two]:pl-0 data-[level=two]:pt-2 data-[level=two]:border-t border-solid border-dark/40 dark:border-light/80 data-[level=three]:pl-6 flex items-center justify-start"
                      >
                        {heading.level === "three" ? (
                          <span className="flex w-1 h-1 rounded-full bg-dark dark:bg-light mr-2">
                            &nbsp;
                          </span>
                        ) : null}
                        <span className="hover:underline">{heading.text}</span>
                      </a>
                    </li>
                  );
                }
              )}
            </ul>
          </details>
        </div>
        <div className="col-span-8">
          <BlogRenderMdx blog={blog} />
        </div>
      </div>
    </article>
  );
};

export default Page;
