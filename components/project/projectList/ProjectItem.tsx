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
          <Image src={project.logo} alt={""} width={50} height={50} />
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

  return (
    <div className="group relative">
      <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
        {project.logo && (
          <Image
            src={project.logo}
            alt={""}
            className="h-full w-full object-cover object-center"
            fill
            sizes="100vw"
          />
        )}
      </div>
      <h3 className="mt-6 text-sm text-gray-500">
        <Link legacyBehavior href={`/projects/${project.slug}`}>
          <a>
            <span className="absolute inset-0" />
            {shortify(project.title)}
          </a>
        </Link>
      </h3>
      <p className="text-base font-semibold text-gray-900">
        {shortify(project.description)}
      </p>
    </div>
  );
};
