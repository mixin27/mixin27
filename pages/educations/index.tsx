import { PageLayout } from "@components/layout";
import { EducationList } from "@components/education";
import { Education } from "@interfaces/Education";
import { getEducationList } from "@lib/educations";
import { GetStaticProps, NextPage } from "next";

type Props = {
  educations: Education[];
};

const EducationsPage: NextPage<Props> = ({ educations }) => {
  return (
    <PageLayout pageTitle="Educations">
      <section className="education">
        <div className="container">
          <div className="row">
            <div className="section-title text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 py-10">
                Educations
              </h1>
            </div>
          </div>

          <EducationList educations={educations} />
        </div>
      </section>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const educations = getEducationList();
  return {
    props: { educations },
  };
};

export default EducationsPage;
