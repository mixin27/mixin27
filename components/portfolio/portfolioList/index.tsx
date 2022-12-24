import { PortfolioItem } from "./PortfolioItem";
import { portfolios } from "./portfolios";

const PortfolioList = () => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {portfolios.map((portfolio) => (
        <PortfolioItem key={portfolio.slug} portfolio={portfolio} />
      ))}
    </div>
  );
};

export default PortfolioList;
