import { Education } from "@interfaces/Education";
import { shortify } from "@lib/client/utils";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";

type Props = {
  education: Education;
};

export const EducationItem: FunctionComponent<Props> = ({ education }) => {
  return (
    <div className="group relative">
      {/* <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
        {education.logo && (
          <Image
            src={project.logo}
            alt={""}
            className="h-full w-full object-cover object-center"
            fill
            sizes="100vw"
          />
        )}
      </div> */}
      <h3 className="mt-6 text-sm text-gray-500">
        <Link legacyBehavior href={`/educations/${education.slug}`}>
          <a>
            <span className="absolute inset-0" />
            {shortify(education.title)}
          </a>
        </Link>
      </h3>
      <p className="text-base font-semibold text-gray-900">
        {shortify(education.description)}
      </p>
    </div>
  );
};
