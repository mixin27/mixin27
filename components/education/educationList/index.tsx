import { Education } from "@interfaces/Education";
import { FunctionComponent } from "react";
import { EducationItem } from "./EducationItem";

type Props = {
  educations: Education[];
};

const EducationList: FunctionComponent<Props> = ({ educations }) => {
  return (
    <div className="row">
      <div className="timeline-box p-4">
        <div className="timeline">
          {educations.map((education) => (
            <EducationItem key={education.slug} education={education} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationList;
