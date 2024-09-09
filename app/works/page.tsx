import React from "react";
import { getProjectList } from "@/lib/project";

import Works from "./works";

function getProjects() {
  const projects = getProjectList();
  return projects;
}

export async function generateMetadata() {
  return {
    title: "Works - Kyaw Zayar Tun",
  };
}

const Page = () => {
  const works = getProjects();
  return (
    <>
      <Works projects={works} />
    </>
  );
};

export default Page;
