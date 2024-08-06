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
      <section className="project">
        <div className="container">
          <div className="row">
            <div className="section-title text-center">
              <h1>My Projects</h1>
            </div>
          </div>
          <ProjectList projects={projects} />
        </div>
      </section>
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
