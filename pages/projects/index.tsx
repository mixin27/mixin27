import { PageLayout } from "@components/layout";
import { ProjectList } from "@components/project";
import { Project } from "@interfaces/Project";
import { getProjectList } from "@lib/projects";
import { GetStaticProps, NextPage } from "next";

type Props = {
  projects: Project[];
};

const ProjectsPage: NextPage<Props> = ({ projects }) => {
  return (
    <PageLayout pageTitle="All Projects">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        My Projects
      </h2>
      <ProjectList projects={projects} />
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const projects = getProjectList();
  return {
    props: { projects },
  };
};

export default ProjectsPage;
