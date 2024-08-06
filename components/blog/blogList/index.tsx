import { FunctionComponent } from "react";

import { Blog } from "@interfaces/Blog";
import { BlogItem } from "./BlogItem";

type Props = {
  blogs: Blog[];
};

const BlogList: FunctionComponent<Props> = ({ blogs }) => {
  return (
    <div className="row">
      <div className="blogs-content">
        {blogs.map((blog) => (
          <BlogItem key={blog.slug} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogList;
