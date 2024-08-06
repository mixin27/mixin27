import { Portfolio } from "@interfaces/Portofolio";
import { FunctionComponent } from "react";
import { PortfolioItem } from "./PortfolioItem";

type Props = {
  portfolios: Portfolio[];
};

const PortfolioList: FunctionComponent<Props> = ({ portfolios }) => {
  return (
    <div className="row">
      <div className="timeline-box p-4">
        <div className="timeline">
          {portfolios.map((portfolio) => (
            <PortfolioItem key={portfolio.slug} portfolio={portfolio} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioList;
