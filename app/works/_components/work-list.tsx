"use client";

import { motion } from "framer-motion";

import { Project } from "@/.contentlayer/generated";
import React from "react";
import WorkItem from "./work-item";

function WorkList({ projects }: { projects: Project[] }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2, duration: 0.4, ease: "easeIn" },
      }}
      className="w-full h-full py-12 container mx-auto xl:px-0"
    >
      <div className="flex flex-col gap-[30px]">
        <h3 className="text-4xl font-bold">My Works</h3>
        <p className="max-w-[600px] text-white/60 xl:mx-0">
          You can explore all of my works.
        </p>

        <ul className="flex flex-col w-full">
          {projects.map((project, index) => (
            <WorkItem key={index} project={project} />
          ))}
        </ul>
      </div>
    </motion.section>
  );
}

export default WorkList;
