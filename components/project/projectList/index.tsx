import { Project } from "@interfaces/Project";
import { FunctionComponent } from "react";
import { ProjectItem } from "./ProjectItem";

type Props = {
  projects: Project[];
};

const ProjectList: FunctionComponent<Props> = ({ projects }) => {
  return (
    <div className="row">
      <div className="project-gallery">
        {projects.map((project) => (
          <ProjectItem key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
