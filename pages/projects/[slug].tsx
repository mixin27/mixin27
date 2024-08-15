import Image from "next/image";
import { PageLayout } from "@components/layout";
import { Project } from "@interfaces/Project";
import { getProjectBySlugWithMarkdown, getProjectsSlugs } from "@lib/projects";
import { GetStaticPaths, GetStaticProps, NextPage } from "next/types";
import { ParsedUrlQuery } from "querystring";

type Props = {
  project: Project;
};

const ProjectDetail: NextPage<Props> = ({ project }) => {
  return (
    <>
      <PageLayout pageTitle={project.title}>
        <div className="pt-0">
          <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {project.title}
              </h1>
            </div>

            <div className="mt-4 lg:row-span-3 lg:mt-0 relative">
              {project.logo && (
                <div>
                  <Image
                    className="w-full object-cover py-2"
                    alt=""
                    src={project.logo}
                    width={500}
                    height={500}
                  />
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Technologies
                </h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="text-gray-400">
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-900">Developers</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    {project.developers.map((developer) => (
                      <li key={developer} className="text-gray-400">
                        <span className="text-gray-600">{developer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="py-2 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                {project.playstoreUrl && (
                  <div className="rounded-md shadow mr-4 my-2">
                    <a
                      href={project.playstoreUrl}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-2 text-base font-medium text-white hover:bg-green-700 md:py-4 md:px-10 md:text-lg"
                    >
                      Playstore
                    </a>
                  </div>
                )}

                {project.appstoreUrl && (
                  <div className="rounded-md shadow mr-4 my-2">
                    <a
                      href={project.appstoreUrl}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-8 py-2 text-base font-medium text-white hover:bg-black md:py-4 md:px-10 md:text-lg"
                    >
                      Appstore
                    </a>
                  </div>
                )}

                {project.githubUrl && (
                  <div className="rounded-md shadow mr-4 my-2">
                    <a
                      href={project.githubUrl}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-8 py-2 text-base font-medium text-white hover:bg-black md:py-4 md:px-10 md:text-lg"
                    >
                      Github
                    </a>
                  </div>
                )}

                {project.link && (
                  <div className="rounded-md shadow mr-4 my-2">
                    <a
                      href={project.link}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-8 py-2 text-base font-medium text-white hover:bg-teal-700 md:py-4 md:px-10 md:text-lg"
                    >
                      Link
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-2 lg:pb-16 lg:pr-8">
              {/* <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    {project.description}
                  </p>
                </div>
              </div> */}

              {project.content && (
                <div>
                  <div className="mt-4 space-y-6">
                    <article className="prose lg:prose-lg markdown-image-50 markdown-code">
                      <div
                        dangerouslySetInnerHTML={{ __html: project.content }}
                      />
                    </article>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const { slug } = context.params!;
  const project = await getProjectBySlugWithMarkdown(slug);
  return {
    props: { project },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const slugs = getProjectsSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

export default ProjectDetail;
