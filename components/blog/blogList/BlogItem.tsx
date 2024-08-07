import { FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/image";

import { Blog } from "@interfaces/Blog";
import { shortify } from "@lib/client/utils";

type Props = {
  blog: Blog;
};

export const BlogItem: FunctionComponent<Props> = ({ blog }) => {
  return (
    <div className="box">
      <div className="img">
        <Image
          priority
          src={blog.coverImage}
          alt={""}
          width={100}
          height={100}
          style={{
            objectFit: "cover",
          }}
        />
      </div>
      <div className="info">
        <span>2 Mar 2020</span> <span>Design</span>
      </div>
      <h3>
        <span aria-hidden="true" className="inset-0" />
        {shortify(blog.title)}
      </h3>
      <p>{shortify(blog.description)}</p>
      <Link legacyBehavior href={`/blogs/${blog.slug}`}>
        <a>Read More</a>
      </Link>
    </div>
  );
};
