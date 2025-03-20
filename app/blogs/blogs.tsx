"use client";

import { Blog } from "@/.contentlayer/generated";
import BlogAllItem from "@/components/elements/blog/blog-all-item";
import { motion } from "framer-motion";

type Props = {
  blogs: Blog[];
};

const Blogs = ({ blogs }: Props) => {
  return (
    <section className="w-full container mx-auto my-16 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-[60px]"
      >
        {blogs.map((blog, index) => {
          return (
            <article key={index} className="col-span-1 row-span-1 relative">
              <BlogAllItem blog={blog} />
            </article>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Blogs;
