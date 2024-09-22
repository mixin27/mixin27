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
} from "react-icons/fa";
import {
  SiFlutter,
  SiNextdotjs,
  SiMysql,
  SiSqlite,
  SiMongodb,
} from "react-icons/si";
import { SlLocationPin, SlInfo } from "react-icons/sl";

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
    "As a dedicated and skilled Flutter developer with a background in Computer Science, I specialize in building efficient, user-friendly mobile applications. With hands-on experience developing apps like Yoyo Chatt, a feature-rich chat platform, and a Myanmar Calendar app supporting multiple languages, I bring creativity and problem-solving skills to every project. My passion for innovation drives me to continuously learn and improve, and I am particularly focused on creating seamless user experiences. I am also actively preparing for the IELTS exam to enhance my communication skills and broaden my international opportunities.",
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
      fieldName: "Email",
      fieldValue: "kyawzayartun.dev@gmail.com",
    },
    {
      fieldName: "Nationality",
      fieldValue: "Burmese (Myanmar)",
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
    "Flutter developer with expertise in building multilingual apps, chat platforms, and educational tools, leveraging Firebase for dynamic features.",
  items: [
    {
      company: "Yangon Yinxiang Yule",
      position: "Senior Mobile Developer",
      duration: "Oct 2023 - Nov 2023",
      location: "Hlaing Thar Yar",
      description: "",
      highlights: [
        "Lead the mobile team in developing a multi-vendor e-commerce application.",
        "Coordinated with stakeholders to ensure project alignment with business objectives.",
        "Collaborated with cross-functional teams to gather and define requirements.",
      ],
    },
    {
      company: "SYSTEMATIC Business Solution",
      position: "Mobile Developer",
      duration: "Apr 2022 - Oct 2023",
      location: "Hlaing",
      description: "",
      highlights: [
        "Lead, maintained, and developed mobile applications in the Flutter team.",
        "Designed and developed user interfaces and experiences for multiple applications.",
        "Converting Android and Xamarine projects to Flutter.",
        "Successfully researched and developed a base framework for Flutter projects, reducing development time by 20%.",
        "Collaborated with cross-functional teams to gather and define requirements, leading to the successful delivery of 3 major projects.",
      ],
    },
    {
      company: "Etrade Myanmar",
      position: "Android Developer",
      duration: "Oct 2019 - Apr 2020",
      location: "Hlaing",
      description:
        "This was a full-time job while I completed my Bachelor of Computer Science.",
      highlights: [
        "Maintained and developed mobile applications.",
        "Designed and developed user interfaces and experiences.",
        "Worked full-time while completing my Bachelor of Computer Science.",
      ],
    },
    {
      company: "IrraHub",
      position: "Internship Web Developer",
      duration: "May 2019 - Aug 2019",
      location: "Shwe Pyi Thar",
      description:
        "This was an internship full-time job while I was studying the final year.",
      highlights: [
        "Worked as a lead developer during my final year of university.",
        "Developed a software solution, service management system, under the guidance of senior developers.",
      ],
    },
  ],
};

// education data
const education = {
  icon: "/assets/resume/cap.svg",
  title: "My education",
  description:
    "A solid academic foundation in Computer Science that fueled my passion for tech innovation and problem-solving, setting the state for my journey in app development.",
  items: [
    {
      institution: "Samsung Tech Institute",
      degree: "Mobile Application Training",
      duration: "May 2018 - Aug 2018",
      location: "Shwe Pyi Thar",
    },
    {
      institution: "University of Computer Studies, Yangon",
      degree: "Bachelor of Computer Science",
      duration: "Nov 2014 - Aug 2019",
      location: "Shwe Pyi Thar",
    },
  ],
};

// skill data
const skills = {
  title: "My skills",
  description:
    "Experienced in Flutter development with a strong focus on building mobile applications, including chat and calendar apps. Skilled in Firebase integration for real-time data handling, authentication, and storage. Proficient in multi-language app development, and implementing custom UI features. Solid foundation in computer science principle and a passion for problem-solving. The followings are some of my expert technologies.",
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
    <motion.section
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
                          className="bg-[#232329]  py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                        >
                          <div className="flex gap-4">
                            <span className="text-accent">{exp.duration}</span>
                            <div className="flex justify-center items-center">
                              <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                  <TooltipTrigger className="w-full h-[20px] bg-[#232329] rounded-xl flex justify-center items-center group">
                                    <div className="text-xl group-hover:text-accent transition-all duration-300">
                                      <SlInfo />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-primary border-primary max-w-[240px] md:max-w-max">
                                    {exp.description && (
                                      <p className="text-white/60 py-1 text-left">
                                        {exp.description}
                                      </p>
                                    )}
                                    <h3 className="text-accent pb-2 text-left">
                                      Highlights
                                    </h3>
                                    <ul className="px-2 text-left ">
                                      {exp.highlights.map(
                                        (highlight, index) => {
                                          return (
                                            <li key={index}>
                                              <div className="flex items-center gap-3">
                                                {/* dot */}
                                                <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
                                                <p className="text-white/60 bg-primary">
                                                  {highlight}
                                                </p>
                                              </div>
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>

                          <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">
                            {exp.position}
                          </h3>

                          <div className="flex items-center gap-3">
                            {/* dot */}
                            <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
                            <p className="text-white/60">{exp.company}</p>
                          </div>

                          {/* location */}
                          <div className="flex items-center gap-3">
                            <SlLocationPin className="text-accent w-[12px] h-[12px]" />
                            <p className="text-white/60">{exp.location}</p>
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
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{education.title}</h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                  {education.description}
                </p>

                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {education.items.map((edu, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                        >
                          <span className="text-accent">{edu.duration}</span>
                          <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">
                            {edu.degree}
                          </h3>
                          <div className="flex items-center gap-3">
                            {/* dot */}
                            <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
                            <p className="text-white/60">{edu.institution}</p>
                          </div>

                          {/* location */}
                          <div className="flex items-center gap-3">
                            <SlLocationPin className="text-accent w-[12px] h-[12px]" />
                            <p className="text-white/60">{edu.location}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* skills */}
            <TabsContent value="skills" className="w-full h-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left mb-4">
                <h3 className="text-4xl font-bold">{skills.title}</h3>
                <p className="max-w-[600px] text-white/60 xl:mx-0">
                  {skills.description}
                </p>

                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 xl:gap-[30px]">
                  {skills.skillList.map((skill, index) => {
                    return (
                      <li key={index}>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className="w-full h-[150px] bg-[#232329] rounded-xl flex justify-center items-center group">
                              <div className="text-6xl group-hover:text-accent transition-all duration-300">
                                {skill.icon}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="capitalize">{skill.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </TabsContent>

            {/* about me */}
            <TabsContent
              value="about"
              className="w-full text-center xl:text-left"
            >
              <div className="flex flex-col gap-[30px]">
                <h3 className="text-4xl font-bold">{about.title}</h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                  {about.description}
                </p>

                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                  {about.info.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="flex items-center justify-center xl:justify-start gap-4"
                      >
                        <span className="text-white/60">{item.fieldName}</span>
                        <span className="text-xl">{item.fieldValue}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default Resume;
