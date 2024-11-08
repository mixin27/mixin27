"use client";

import { FunctionComponent } from "react";
import CountUp from "react-countup";

const stats = [
  {
    num: 3,
    text: "+Years of experience",
  },
  {
    num: 14,
    text: "Projects completed",
  },
  {
    num: 12,
    text: "Technologies master",
  },
  {
    num: 233,
    text: "Code commits (2024)",
  },
];

const Stats: FunctionComponent = () => {
  return (
    <section className="pt-4 pb-12 xl:pb-0">
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-6 max-w-[80vw] mx-auto xl:max-w-none">
          {stats.map((stat, index) => {
            return (
              <div
                key={index}
                className="flex-1 flex gap-4 justify-center items-center xl:justify-start"
              >
                <CountUp
                  end={stat.num}
                  duration={5}
                  delay={2}
                  className="text-4xl xl:text-6xl font-extrabold"
                />
                <p
                  className={`${
                    stat.text.length < 15 ? "max-w-[100px]" : "max-w-[150px]"
                  } leading-snug text-white/80`}
                >
                  {stat.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
