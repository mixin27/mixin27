import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

// rounded-sm bg-slate-950 px-[0.5rem] py-1 font-mono text-sm text-foreground text-pretty leading-relaxed text-white
export const BasicItems = {
  code: (props: HTMLAttributes<HTMLElement>) => {
    const { className, ...rest } = props;
    return <code className={cn(className)} {...rest} />;
  },
};
