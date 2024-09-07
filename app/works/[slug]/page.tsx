import { getProjectBySlugWithMarkdown } from "@/lib/project";
import WorkDetail from "./detail";

const Page = async ({ params }: { params: { slug: string } }) => {
  const project = await getProjectBySlugWithMarkdown(params.slug);

  return (
    <>
      <WorkDetail project={project} />
    </>
  );
};

export default Page;
