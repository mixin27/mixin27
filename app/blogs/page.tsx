"use client";

import { allBlogs } from "@/.contentlayer/generated";
import BlogAllItem from "@/components/elements/blog/blog-all-item";
import { motion } from "framer-motion";

const Blogs = () => {
  return (
    <section className="w-full my-16 px-32 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-[60px]"
      >
        {allBlogs.map((blog, index) => {
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
