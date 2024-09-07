import { getBlogList } from "@/lib/blog";
import Blogs from "./blogs";

function getBlogs() {
  const blogs = getBlogList();
  return blogs;
}

const Page = () => {
  const result = getBlogs();
  return (
    <>
      <Blogs blogs={result} />
    </>
  );
};

export default Page;
