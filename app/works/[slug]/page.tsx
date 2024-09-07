import { getProjectBySlugWithMarkdown, getProjectList } from "@/lib/project";

import WorkDetail from "./detail";
import { Project } from "@/interfaces/project";

async function getProject(slug: string): Promise<Project> {
  const project = await getProjectBySlugWithMarkdown(slug);
  return project;
}

export async function generateStaticParams() {
  const projects = getProjectList();

  return projects.map((project: Project) => ({
    slug: project.slug,
    project,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);

  return {
    title: project.title,
  };
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const project = await getProject(params.slug);

  return (
    <>
      <WorkDetail project={project} />
    </>
  );
};

export default Page;
