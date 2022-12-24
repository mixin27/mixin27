import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";

import { BlogList } from "../components/blog";
import { PortfolioList } from "../components/portfolio";
import { BaseLayout } from "../components/layout";
import { getBlogList } from "../lib/blogs";

const Home: NextPage = () => {
  return (
    <BaseLayout>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Newest Blogs
        <Link legacyBehavior href="/blogs">
          <a className="text-sm ml-1 text-indigo-600">(See All)</a>
        </Link>
      </h2>

      <BlogList />

      <br></br>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Portfolios
        <Link legacyBehavior href="/portfolios">
          <a className="text-sm ml-1 text-indigo-600">(See All)</a>
        </Link>
      </h2>

      <PortfolioList />
    </BaseLayout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const blogs = getBlogList();
  console.log(blogs);

  return {
    props: {},
  };
};

export default Home;
