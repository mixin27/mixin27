import Image from "next/image";
import { Project } from "@/.contentlayer/generated";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import React from "react";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { FaAppStore, FaEye, FaGooglePlay } from "react-icons/fa";
import { cn } from "@/lib/utils";

function WorkItem({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col md:flex-row md:gap-[30px] gap-2", className)}
    >
      <div className="w-full md:w-[35%]">
        <div className="h-[400px] md:h-[400px] relative group flex justify-center items-center bg-pink-50/20">
          {/* overlay */}
          <div className="absolute top-0 bottom-0 w-full h-full bg-black/10 z-10"></div>

          {/* image */}
          <div className="relative w-full h-full">
            <Image
              src={project.image.filePath.replace("../public", "")}
              fill
              className="object-cover"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="w-full md:w-[65%] md:h-[460px] flex flex-col md:justify-between order-2 md:order-none justify-center py-4 md:py-0">
        <div className="flex flex-col gap-[20px] h-[50%]">
          {/* category */}
          <div className="text-xl leading-none font-extrabold text-white/60">
            {project.category}
          </div>

          {/* project title */}
          <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
            {project.title}
          </h2>

          {/* project description */}
          <p className="text-white/60">{project.description}</p>

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
          <div className="flex items-center gap-2">
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

            <Link
              href={`/works/${project._raw.flattenedPath.replace(
                "projects/",
                ""
              )}`}
            >
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group">
                    <FaEye className="text-white text-3xl group-hover:text-accent" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkItem;
