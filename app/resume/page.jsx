"use client";

import { motion } from "framer-motion";
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaNodeJs,
  FaJava,
  FaAndroid,
  FaMobile,
} from "react-icons/fa";
import {
  SiFlutter,
  SiNextdotjs,
  SiMysql,
  SiSqlite,
  SiMongodb,
} from "react-icons/si";

// components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

// about data
const about = {
  title: "About Me",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro delectus autem maxime odit dolorum.",
  info: [
    {
      fieldName: "Name",
      fieldValue: "Kyaw Zayar Tun",
    },
    {
      fieldName: "Phone",
      fieldValue: "(+95) 9 799 967 180",
    },
    {
      fieldName: "Experience",
      fieldValue: "3+ Years",
    },
    {
      fieldName: "Nationality",
      fieldValue: "Burmese (Myanmar)",
    },
    {
      fieldName: "Email",
      fieldValue: "kyawzayartun.dev@gmail.com",
    },
    {
      fieldName: "Freelance",
      fieldValue: "Available",
    },
    {
      fieldName: "Languages",
      fieldValue: "Burmese, English",
    },
  ],
};

// experience data
const experience = {
  icon: "/assets/resume/badge.svg",
  title: "My experience",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro delectus autem maxime odit dolorum.",
  items: [
    {
      company: "Yangon Yanxiang Yule",
      position: "Senior Mobile Developer",
      duration: "Oct 2023 - Nov 2023",
    },
    {
      company: "SYSTEMATIC Business Solution",
      position: "Mobile Developer",
      duration: "Mar 2022 - Oct 2023",
    },
    {
      company: "Etrade Myanmar",
      position: "Android Developer",
      duration: "Oct 2019 - Apr 2020",
    },
    {
      company: "IrraHub",
      position: "Internship Web Developer",
      duration: "May 2019 - Aug 2019",
    },
  ],
};

// education data
const education = {
  icon: "/assets/resume/cap.svg",
  title: "My education",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro delectus autem maxime odit dolorum.",
  items: [
    {
      institution: "Samsung Tech Institute",
      degree: "Mobile Application Training",
      duration: "May 2018 - Aug 2018",
    },
    {
      institution: "University of Computer Studies, Yangon",
      degree: "Bachelor of Computer Science",
      duration: "Nov 2014 - Aug 2019",
    },
  ],
};

// skill data
const skills = {
  title: "My skills",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti optio beatae esse voluptas.",
  skillList: [
    {
      icon: <FaHtml5 />,
      name: "html 5",
    },
    {
      icon: <FaCss3 />,
      name: "css 3",
    },
    {
      icon: <FaJs />,
      name: "javascript",
    },
    {
      icon: <FaJava />,
      name: "java",
    },
    {
      icon: <FaAndroid />,
      name: "android",
    },
    {
      icon: <SiFlutter />,
      name: "flutter",
    },
    {
      icon: <FaNodeJs />,
      name: "node.js",
    },
    {
      icon: <FaReact />,
      name: "react.js",
    },
    {
      icon: <SiNextdotjs />,
      name: "next.js",
    },
    {
      icon: <FaHtml5 />,
      name: "html 5",
    },
    {
      icon: <SiMysql />,
      name: "mysql",
    },
    {
      icon: <SiSqlite />,
      name: "sqlite",
    },
    {
      icon: <SiMongodb />,
      name: "mongodb",
    },
  ],
};

const Resume = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0"
    >
      <div className="container mx-auto">
        <Tabs
          defaultValue="experience"
          className="flex flex-col xl:flex-row gap-[60px]"
        >
          <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="about">About me</TabsTrigger>
          </TabsList>

          {/* content */}
          <div className="min-h-[70vh] w-full">
            {/* experience */}
            <TabsContent value="experience" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{experience.title}</h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                  {experience.description}
                </p>

                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {experience.items.map((exp, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                        >
                          <span className="text-accent">{exp.duration}</span>
                          <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">
                            {exp.position}
                          </h3>
                          <div className="flex items-center gap-3">
                            {/* dot */}
                            <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
                            <p className="text-white/60">{exp.company}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* education */}
            <TabsContent value="education" className="w-full">
              education
            </TabsContent>

            {/* skills */}
            <TabsContent value="skills" className="w-full">
              skills
            </TabsContent>

            {/* about me */}
            <TabsContent value="about" className="w-full">
              about me
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Resume;
