"use client";

import { Content } from "@/.contentlayer/generated";
import AppsAllItem from "@/components/elements/apps/apps-all-item";
import { motion } from "framer-motion";

type Props = {
  apps: Content[];
};

const AppsPages = ({ apps }: Props) => {
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
        {apps.map((app, index) => {
          return (
            <article key={index} className="col-span-1 row-span-1 relative">
              <AppsAllItem appContent={app} />
            </article>
          );
        })}
      </motion.div>
    </section>
  );
};

export default AppsPages;
