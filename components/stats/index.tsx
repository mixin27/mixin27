"use client";

import { GetTotalCommits } from "@/actions/get-commits";
import { FunctionComponent, useEffect, useState } from "react";
import CountUp from "react-countup";

type StatsType = {
  num: number;
  text: string;
};

const initialStats: StatsType[] = [
  {
    num: 3,
    text: "+Years of experience",
  },
  {
    num: 15,
    text: "Projects completed",
  },
  {
    num: 12,
    text: "Technologies master",
  },
  {
    num: 0,
    text: "Code commits (Github)",
  },
];

const Stats: FunctionComponent = () => {
  const [stats, setStats] = useState<StatsType[]>(initialStats);

  useEffect(() => {
    async function fetchTotalCommit() {
      const res = await GetTotalCommits();
      initialStats[3] = {
        num: res,
        text: "Code commits (Github)",
      };

      setStats([...initialStats]);
    }

    fetchTotalCommit();
  }, []);

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
