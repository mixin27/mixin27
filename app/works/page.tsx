"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { FaGooglePlay, FaAppStore, FaEye } from "react-icons/fa";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";
import Image from "next/image";
import WorkSliderButtons from "@/components/buttons/WorkSliderButtons";
import { allProjects } from "@/.contentlayer/generated";

const Works = () => {
  const [project, setProject] = useState(allProjects[0]);

  return (
    <motion.section
      key={project._id}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex flex-col justify-center py-12 xl:px-0"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row xl:gap-[30px]">
          <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col xl:justify-between order-2 xl:order-none">
            <div className="flex flex-col gap-[30px] h-[50%]">
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
                        {tag}
                        {index !== project.tags!.length - 1 && ","}
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* border */}
              <div className="border border-white/20"></div>

              {/* buttons */}
              <div className="flex justify-between mr-4">
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

          {/* slider */}
          <div className="w-full xl:w-[50%]">
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              className="xl:h-[520px] mb-12"
              onSlideChange={(swiper) => {
                const currentIndex = swiper.activeIndex;

                setProject(allProjects[currentIndex]);
              }}
            >
              {allProjects.map((project, index) => {
                return (
                  <SwiperSlide key={index} className="w-full">
                    <div className="h-[460px] relative group flex justify-center items-center bg-pink-50/20">
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
                  </SwiperSlide>
                );
              })}

              {/* buttons */}
              <WorkSliderButtons
                containerStyles="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] xl:bottom-0 z-20 w-full justify-between xl:w-max xl:justify-none"
                btnStyles="bg-accent hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all"
                iconStyles=""
              />
            </Swiper>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Works;
