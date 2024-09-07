"use client";

import { Blog } from "@/interfaces/blog";
import { motion } from "framer-motion";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { BsArrowDownRight } from "react-icons/bs";

type Props = {
  blogs: Blog[];
};

const Blogs: NextPage<Props> = ({ blogs }) => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center py-12 xl:py-0">
      <div className="container mx-auto">
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
              <div
                key={index}
                className="flex-1 flex flex-col justify-center gap-6 group"
              >
                {/* top */}
                <div className="w-full flex justify-between items-center">
                  <div className="relative h-14 w-14 md:h-20 md:w-20">
                    <Image
                      priority
                      fill
                      className="rounded-full object-cover"
                      src={blog.authorImage}
                      alt=""
                    />
                  </div>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45"
                  >
                    <BsArrowDownRight className="text-primary text-3xl" />
                  </Link>
                </div>

                {/* title */}
                <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500">
                  {blog.title}
                </h2>

                {/* description */}
                <p className="text-white/60">{blog.description}</p>

                {/* border */}
                <div className="border-b border-white/20 w-full"></div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Blogs;
