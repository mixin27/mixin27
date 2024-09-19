"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { FaAppStore, FaGooglePlay } from "react-icons/fa";
import { allProjects } from "@/.contentlayer/generated";
import ProjectRenderMdx from "@/components/elements/project/project-render-mdx";

const WorkDetail = ({ params }: { params: { slug: string } }) => {
  const project = allProjects.find(
    (project) =>
      project._raw.flattenedPath.replace("projects/", "") === params.slug
  );

  if (!project) return <>No found</>;

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="w-full xl:w-[70%]">
          <div className="my-16">
            {/* project title */}
            <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
              {project.title}
            </h2>
            {/* project description */}
            <p className="text-white/60">{project.description}</p>
          </div>

          <ProjectRenderMdx project={project} />
        </div>

        <div className="w-full xl:w-[30%] flex flex-col gap-[30px] order-1 xl:order-none my-16">
          {/* image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 2.4, duration: 0.4, ease: "easeInOut" },
            }}
            className="relative w-full h-[320px]"
          >
            <Image
              src={project.image.filePath.replace("../public", "")}
              fill
              className="object-cover"
              alt=""
            />
          </motion.div>

          {/* stacks */}
          {project.tags && (
            <ul className="flex gap-4 flex-wrap">
              {project.tags.map((tag, index) => {
                return (
                  <li key={index} className="text-xl text-accent">
                    #{tag}
                    {index !== project.tags!.length - 1 && ","}
                  </li>
                );
              })}
            </ul>
          )}

          {/* border */}
          <div className="border border-white/20"></div>

          {/* buttons */}
          <div className="flex items-center gap-4">
            {project.links &&
              project.links.map((link) => {
                return (
                  <div key={link._id}>
                    {/* live button */}
                    {link.live && (
                      <Link href={link.live}>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group">
                              <BsArrowUpRight className="text-white text-3xl group-hover:text-accent" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Live project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Link>
                    )}

                    {/* github button */}
                    {link.github && (
                      <Link href={link.github}>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group">
                              <BsGithub className="text-white text-3xl group-hover:text-accent" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Github repository</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Link>
                    )}

                    {/* playstore button */}
                    {link.playstore && (
                      <Link href={link.playstore}>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group">
                              <FaGooglePlay className="text-white text-3xl group-hover:text-accent" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Google playstore</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Link>
                    )}

                    {/* appstore button */}
                    {link.appstore && (
                      <Link href={link.appstore}>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group">
                              <FaAppStore className="text-white text-3xl group-hover:text-accent" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Appstore</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Link>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetail;
