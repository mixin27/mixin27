import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Education } from "@interfaces/Education";
import { FunctionComponent } from "react";

type Props = {
  education: Education;
};

export const EducationItem: FunctionComponent<Props> = ({ education }) => {
  return (
    <div className="timeline-item">
      <div className="circle-dot"></div>
      <h6 className="timeline-date">
        <FontAwesomeIcon className="fa" icon={faCalendar} />{" "}
        {education.fromDate} - {education.toDate}
      </h6>
      <h4 className="timeline-title">{education.title}</h4>
      <p className="timeline-text">{education.description}</p>

      {/* {education.courses && (
        <div className="px-3 py-1">
          {education.courses.map((course, idx) => (
            <li key={idx}>{course}</li>
          ))}
        </div>
      )} */}
    </div>
  );
};
