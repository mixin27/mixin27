import { Education } from "@interfaces/Education";
import { FunctionComponent } from "react";
import { EducationItem } from "./EducationItem";

type Props = {
  educations: Education[];
};

const EducationList: FunctionComponent<Props> = ({ educations }) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {educations.map((education) => (
        <EducationItem key={education.slug} education={education} />
      ))}
    </div>
  );
};

export default EducationList;
