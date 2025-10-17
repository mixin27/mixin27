import { Content } from "@/.contentlayer/generated";
import Link from "next/link";
import { format } from "date-fns";

type Props = {
  appContent: Content;
};

const AppsAllItem = ({ appContent }: Props) => {
  return (
    <div className="flex flex-col items-center text-white group">

      <div className="flex flex-col w-full mt-4">

        <Link href={`/apps/${appContent._raw.flattenedPath.replace(
                "contents/",
                ""
              )}/privacy`} className="inline-block my-1">
          <h2 className="font-semibold capitalize text-lg text-white">
            <span className="bg-gradient-to-r from-accent/50 dark:from-accentDark/50 to-accent/50 dark:to-accentDark/50 bg-[length:0px_6px] group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
              {appContent.title}
            </span>
          </h2>
        </Link>

        <span className="capitalize text-white/50 font-semibold text-base">
          {format(new Date(appContent.publishedAt), "MMMM dd, yyyy")}
        </span>
      </div>
    </div>
  );
};

export default AppsAllItem;
