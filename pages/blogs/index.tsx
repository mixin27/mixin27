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
      <section className="blogs">
        <div className="container">
          <div className="row">
            <div className="section-title text-center">
              <h1>Blogs</h1>
            </div>
          </div>
          <BlogList blogs={blogs} />
        </div>
      </section>
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
