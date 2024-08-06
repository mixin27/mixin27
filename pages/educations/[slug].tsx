import Image from "next/image";
import { PageLayout } from "@components/layout";
import { Education } from "@interfaces/Education";
import {
  getEducationBySlugWithMarkdown,
  getEducationSlugs,
} from "@lib/educations";
import { GetStaticPaths, GetStaticProps, NextPage } from "next/types";
import { ParsedUrlQuery } from "querystring";

type Props = {
  education: Education;
};

const ProjectDetail: NextPage<Props> = ({ education }) => {
  return (
    <>
      <PageLayout pageTitle={education.title}>
        <div className="pt-6">
          <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {education.title}
              </h1>
            </div>

            {/* {project.logo && (
              <div className="mt-4 lg:row-span-3 lg:mt-0 relative">
                <Image
                  fill
                  className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
                  alt=""
                  src={project.logo}
                />
              </div>
            )} */}

            {education.website && (
              <div className="rounded-md shadow mr-4 my-2">
                <a
                  href={education.website}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-8 py-2 text-base font-medium text-white hover:bg-teal-700 md:py-4 md:px-10 md:text-lg"
                >
                  Website
                </a>
              </div>
            )}
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">
                  {education.description}
                </p>
              </div>
            </div>

            {education.courses.length > 0 ? (
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Courses</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    {education.courses.map((course) => (
                      <li key={course} className="text-gray-400">
                        <span className="text-gray-600">{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <></>
            )}

            {education.content && (
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>
                <div className="mt-4 space-y-6">
                  <article className="text-sm text-gray-600">
                    <div
                      dangerouslySetInnerHTML={{ __html: education.content }}
                    />
                  </article>
                </div>
              </div>
            )}
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
  const education = await getEducationBySlugWithMarkdown(slug);
  return {
    props: { education },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const slugs = getEducationSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

export default ProjectDetail;
