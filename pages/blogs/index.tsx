import { BlogList } from "@components/blog";
import { PageLayout } from "@components/layout";
import { Blog } from "@interfaces/Blog";
import { getBlogList } from "@lib/blogs";
import { GetStaticProps, NextPage } from "next";

type Props = {
  blogs: Blog[];
};

const BlogsPage: NextPage<Props> = ({ blogs }) => {
  return (
    <PageLayout pageTitle="All Blogs">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        All Blogs
      </h2>
      <BlogList blogs={blogs} />
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const blogs = getBlogList();
  return {
    props: { blogs },
  };
};

export default BlogsPage;
