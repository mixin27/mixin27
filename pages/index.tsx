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

type Props = {
  blogs: Blog[];
  portfolios: Portfolio[];
};

const Home: NextPage<Props> = ({ blogs, portfolios }) => {
  return (
    <BaseLayout>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Newest Blogs
        <Link legacyBehavior href="/blogs">
          <a className="text-sm ml-1 text-indigo-600">(See All)</a>
        </Link>
      </h2>

      <BlogList blogs={blogs} />

      <br></br>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Portfolios
        <Link legacyBehavior href="/portfolios">
          <a className="text-sm ml-1 text-indigo-600">(See All)</a>
        </Link>
      </h2>

      <PortfolioList portfolios={portfolios} />
    </BaseLayout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const blogs = getBlogList();
  const portfolios = getPortfolioList();
  const content: MarkdownContent = {
    blogs,
    portfolios,
  };
  saveSearchData(content);

  return {
    props: {
      blogs: blogs.splice(0, 4),
      portfolios: portfolios.splice(0, 4),
    },
  };
};

export default Home;
