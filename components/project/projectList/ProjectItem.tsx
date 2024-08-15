import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Project } from "@interfaces/Project";
import { shortify } from "@lib/client/utils";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";

type Props = {
  project: Project;
};

export const ProjectItem: FunctionComponent<Props> = ({ project }) => {
  return (
    <div className="item">
      <div className="inner">
        {project.logo && (
          <Image
            src={project.logo}
            alt={""}
            quality={100}
            width={500}
            height={500}
            layout="responsive"
          />
        )}
        <div className="overlay">
          <Link legacyBehavior href={`/projects/${project.slug}`}>
            <FontAwesomeIcon className="fa" icon={faEye} />
          </Link>
          <h4>{shortify(project.title)}</h4>
          <p>{shortify(project.description)}</p>
        </div>
      </div>
    </div>
  );
};
