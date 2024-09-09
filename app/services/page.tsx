"use client";

import { BsArrowDownRight } from "react-icons/bs";
import Link from "next/link";
import { motion } from "framer-motion";

// TODO: replace with actual services.
const services = [
  {
    num: "01",
    title: "Mobile Development",
    description:
      "We specialize in creating high-performance mobile applications for iOS and Android, using Flutter and native technologies. Our services include full-cycle development, from design to deployment, ensuring scalable and user-friendly apps tailored to your business need.",
    href: "/contact",
  },
  {
    num: "02",
    title: "Web Development",
    description:
      "We offer end-toend web development solutions, crafting dynamic, responsive, and secure websites. Our team leverages the latest technologies and best practices to build scalable web applications that deliver optimal performance, user enagagement, and business growth.",
    href: "/contact",
  },
  {
    num: "03",
    title: "Playstore Deployment",
    description:
      "We provide seamless app deployment services, ensuring your mobile and web applications are efficiently launched cross platforms. Our team handles the entire process, from configuration to release, optimizing for performance, security, and compliance with platform-specific guidelines.",
    href: "/contact",
  },
];

const Services = () => {
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
          {services.map((service, index) => {
            return (
              <div
                key={index}
                className="flex-1 flex flex-col justify-center gap-6 group"
              >
                {/* top */}
                <div className="w-full flex justify-between items-center">
                  <div className="text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover transition-all duration-500">
                    {service.num}
                  </div>
                  <Link
                    href={service.href}
                    className="w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45"
                  >
                    <BsArrowDownRight className="text-primary text-3xl" />
                  </Link>
                </div>

                {/* title */}
                <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500">
                  {service.title}
                </h2>

                {/* description */}
                <p className="text-white/60">{service.description}</p>

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

export default Services;
