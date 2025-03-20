import { Blog } from "@/.contentlayer/generated";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

type Props = {
  blog: Blog;
};

const BlogAllItem = ({ blog }: Props) => {
  return (
    <div className="flex flex-col items-center text-white group">
      <Link
        href={blog._raw.flattenedPath}
        className="h-full rounded-xl overflow-hidden"
      >
        <Image
          src={blog.image.filePath.replace("../public", "")}
          placeholder="blur"
          blurDataURL={blog.image.blurhashDataUrl}
          alt={blog.title}
          width={blog.image.width}
          height={blog.image.height}
          className="aspect-[4/3] w-full h-full object-center object-cover rounded-xl group-hover:scale-105 transition-all ease duration-300"
        />
      </Link>

      <div className="flex flex-col w-full mt-4">
        {blog.tags && (
          <span className="uppercase text-accent dark:text-accentDark font-semibold text-xl">
            {blog.tags[0]}
          </span>
        )}

        <Link href={blog._raw.flattenedPath} className="inline-block my-1">
          <h2 className="font-semibold capitalize text-lg text-white">
            <span className="bg-gradient-to-r from-accent/50 dark:from-accentDark/50 to-accent/50 dark:to-accentDark/50 bg-[length:0px_6px] group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
              {blog.title}
            </span>
          </h2>
        </Link>

        <span className="capitalize text-white/50 font-semibold text-base">
          {format(new Date(blog.publishedAt), "MMMM dd, yyyy")}
        </span>
      </div>
    </div>
  );
};

export default BlogAllItem;
