import { join } from "path";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";

import { BlogList } from "../components/blog";
import { PortfolioList } from "../components/portfolio";
import { BaseLayout } from "../components/layout";
import { getBlogContent, getBlogFileNames } from "../lib/md";

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
  // Get all file names from blogs directory.
  const blogFileNames = getBlogFileNames();

  blogFileNames.forEach((fileName) => {
    // Read blog content from file
    const blogContent = getBlogContent(fileName);
    console.log(blogContent);
  });

  return {
    props: {},
  };
};

export default Home;
