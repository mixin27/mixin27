"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { BsArrowUpRight, BsGithub } from "react-icons/bs";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";
import Image from "next/image";
import WorkSliderButtons from "@/components/buttons/WorkSliderButtons";

const projects = [
  {
    num: "01",
    category: "mobile",
    title: "myanmar calendar",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe, voluptatum dolore non ipsam minus quidem est.",
    stacks: [
      { name: "Flutter" },
      { name: "flutter_mmcalendar" },
      { name: "Firebase" },
    ],
    image: "/assets/work/myanmar_calendar.png",
    live: "https://play.google.com/store/apps/details?id=dev.mixin27.mmcalendar",
    github: "https://github.com/mixin27/mmcalendar",
  },
  {
    num: "02",
    category: "mobile",
    title: "yoyo chatt",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe, voluptatum dolore non ipsam minus quidem est.",
    stacks: [{ name: "Flutter" }, { name: "Firebase" }],
    image: "/assets/work/yoyo_chatt.png",
    live: "https://play.google.com/store/apps/details?id=com.norm.yoyo_chatt",
    github: "https://github.com/mixin27/yoyo_chatt",
  },
  {
    num: "03",
    category: "flutter package",
    title: "flutter_mmcalendar",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe, voluptatum dolore non ipsam minus quidem est.",
    stacks: [{ name: "Flutter" }, { name: "Dart" }],
    image: "/assets/work/dart.png",
    live: "https://pub.dev/packages/flutter_mmcalendar",
    github: "https://github.com/mixin27/flutter-mmcalendar",
  },
];

const Works = () => {
  const [project, setProject] = useState(projects[0]);

  return (
    <motion.section
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
              {/* outlined num */}
              <div className="text-8xl leading-none font-extrabold text-transparent text-outline">
                {project.num}
              </div>

              {/* project category */}
              <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
                {project.category} project
              </h2>

              {/* project description */}
              <p className="text-white/60">{project.description}</p>

              {/* stacks */}
              <ul className="flex gap-4">
                {project.stacks.map((item, index) => {
                  return (
                    <li key={index} className="text-xl text-accent">
                      {item.name}
                      {index !== project.stacks.length - 1 && ","}
                    </li>
                  );
                })}
              </ul>

              {/* border */}
              <div className="border border-white/20"></div>

              {/* buttons */}
              <div className="flex items-center gap-4">
                {/* live button */}
                <Link href={project.live}>
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

                {/* github button */}
                <Link href={project.github}>
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

                setProject(projects[currentIndex]);
              }}
            >
              {projects.map((item, index) => {
                return (
                  <SwiperSlide key={index} className="w-full">
                    <div className="h-[460px] relative group flex justify-center items-center bg-pink-50/20">
                      {/* overlay */}
                      <div className="absolute top-0 bottom-0 w-full h-full bg-black/10 z-10"></div>

                      {/* image */}
                      <div className="relative w-full h-full">
                        <Image
                          src={project.image}
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
