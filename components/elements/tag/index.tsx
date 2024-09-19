import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  link: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [rest: string]: any;
};

const Tag = ({ link = "#", name, ...rest }: Props) => {
  return (
    <Link
      href={link}
      className={cn(
        "inline-block py-3 px-10 bg-dark text-white rounded-full capitalize font-semibold border-2 border-solid border-light hover:scale-105 transition-all ease duration-200",
        rest.className
      )}
    >
      {name}
    </Link>
  );
};

export default Tag;
