import React from "react";
import { getProjectList } from "@/lib/project";

import Works from "./works";

function getProjects() {
  const projects = getProjectList();
  return projects;
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
