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
    <PageLayout pageTitle="All Educations">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Educations
      </h2>
      <EducationList educations={educations} />
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
