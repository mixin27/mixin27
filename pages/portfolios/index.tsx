import { PageLayout } from "@components/layout";
import { PortfolioList } from "@components/portfolio";
import { Portfolio } from "@interfaces/Portofolio";
import { getPortfolioList } from "@lib/portfolios";
import { GetStaticProps, NextPage } from "next";

type Props = {
  portfolios: Portfolio[];
};

const PortfoliosPage: NextPage<Props> = ({ portfolios }) => {
  return (
    <PageLayout pageTitle="All Portfolios">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        My Work Experiences
      </h2>
      <PortfolioList portfolios={portfolios} />
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const portfolios = getPortfolioList();
  return {
    props: { portfolios },
  };
};

export default PortfoliosPage;
