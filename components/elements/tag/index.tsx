import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = React.HTMLAttributes<React.CSSProperties> & {
  link?: string;
  name: string;
};

const Tag = ({ link = "#", name, className = "" }: Props) => {
  return (
    <Link
      href={link}
      className={cn(
        "inline-block py-3 px-10 bg-dark text-white rounded-full capitalize font-semibold border-2 border-solid border-light hover:scale-105 transition-all ease duration-200",
        className
      )}
    >
      {name}
    </Link>
  );
};

export default Tag;
