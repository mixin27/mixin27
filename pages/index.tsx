import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { BlogList } from "@components/blog";
import { BaseLayout } from "@components/layout";
import { PortfolioList } from "@components/portfolio";
import { Blog } from "@interfaces/Blog";
import { Portfolio } from "@interfaces/Portofolio";
import { getBlogList } from "@lib/blogs";
import { getPortfolioList } from "@lib/portfolios";
import { saveSearchData } from "@lib/helpers";
import { MarkdownContent } from "@interfaces/Markdown";
import { ProjectList } from "@components/project";
import { getProjectList } from "@lib/projects";
import { Project } from "@interfaces/Project";
import { Education } from "@interfaces/Education";
import { EducationList } from "@components/education";
import { getEducationList } from "@lib/educations";

type Props = {
  blogs: Blog[];
  portfolios: Portfolio[];
  projects: Project[];
  educations: Education[];
};

const Home: NextPage<Props> = ({ blogs, portfolios, projects, educations }) => {
  return (
    <BaseLayout>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Educations
        <Link legacyBehavior href="/portfolios">
          <a className="text-sm ml-1 text-indigo-600">(See All)</a>
        </Link>
      </h2>

      <EducationList educations={educations} />

      <br></br>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Work Experiences
        <Link legacyBehavior href="/portfolios">
          <a className="text-sm ml-1 text-indigo-600">(See All)</a>
        </Link>
      </h2>

      <PortfolioList portfolios={portfolios} />

      <br></br>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Projects
        <Link legacyBehavior href="/portfolios">
          <a className="text-sm ml-1 text-indigo-600">(See All)</a>
        </Link>
      </h2>

      <ProjectList projects={projects} />

      <br></br>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Newest Blogs
        <Link legacyBehavior href="/blogs">
          <a className="text-sm ml-1 text-indigo-600">(See All)</a>
        </Link>
      </h2>

      <BlogList blogs={blogs} />
    </BaseLayout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const blogs = getBlogList();
  const portfolios = getPortfolioList();
  const projects = getProjectList();
  const educations = getEducationList();
  const content: MarkdownContent = {
    blogs,
    portfolios,
    projects,
    educations,
  };
  saveSearchData(content);

  return {
    props: {
      blogs: blogs.splice(0, 4),
      portfolios: portfolios.splice(0, 4),
      projects: projects.splice(0, 4),
      educations: educations.splice(0, 4),
    },
  };
};

export default Home;
