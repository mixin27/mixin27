import { NextPage } from "next";
import Image from "next/image";
import { Project } from "@/interfaces/project";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { FaAppStore, FaGooglePlay } from "react-icons/fa";

type Props = {
  project: Project;
};

const WorkDetail: NextPage<Props> = ({ project }) => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6 xl:flex-row">
        <article className="prose prose-invert lg:prose-lg markdown-image-50 markdown-code order-2 xl:order-none">
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
        </article>

        <div className="flex flex-col gap-[30px] order-1 xl:order-none">
          {/* project title */}
          <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
            {project.title}
          </h2>
          {/* project description */}
          <p className="text-white/60">{project.description}</p>

          {/* image */}
          <div className="relative w-full h-[320px]">
            <Image src={project.image} fill className="object-cover" alt="" />
          </div>

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
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              {/* live button */}
              {project.live && (
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
              )}

              {/* github button */}
              {project.github && (
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
              )}

              {/* playstore button */}
              {project.playstore && (
                <Link href={project.playstore}>
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
              {project.appstore && (
                <Link href={project.appstore}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetail;
