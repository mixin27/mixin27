import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Portfolio } from "@interfaces/Portofolio";
import { FunctionComponent } from "react";

type Props = {
  portfolio: Portfolio;
};

export const PortfolioItem: FunctionComponent<Props> = ({ portfolio }) => {
  return (
    <div className="timeline-item">
      <div className="circle-dot"></div>
      <h6 className="timeline-date">
        <FontAwesomeIcon className="fa" icon={faCalendar} />{" "}
        {portfolio.fromDate} - {portfolio.toDate}
      </h6>
      <h4 className="timeline-title">{portfolio.title}</h4>
      <p className="timeline-text">{portfolio.description}</p>

      {portfolio.highlights && (
        <div className="px-3 py-1">
          {portfolio.highlights.map((exp, idx) => (
            <li key={idx}>{exp}</li>
          ))}
        </div>
      )}
    </div>
  );
};
