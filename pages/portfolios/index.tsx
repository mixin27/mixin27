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
    <PageLayout pageTitle="Experiences">
      <section className="experience">
        <div className="container">
          <div className="row">
            <div className="section-title text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 py-10">
                Experiences
              </h1>
            </div>
          </div>

          <PortfolioList portfolios={portfolios} />
        </div>
      </section>
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
