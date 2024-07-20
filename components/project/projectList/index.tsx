import { Project } from "@interfaces/Project";
import { FunctionComponent } from "react";
import { ProjectItem } from "./ProjectItem";

type Props = {
  projects: Project[];
};

const ProjectList: FunctionComponent<Props> = ({ projects }) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {projects.map((project) => (
        <ProjectItem key={project.slug} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
