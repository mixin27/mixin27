"use client";

import { Checks, ClipboardText } from "@phosphor-icons/react";
import { useState } from "react";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";

// const buttonClasses =
//   "flex items-center text-xs font-medium text-white rounded";

interface CopyButtonProps extends ButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className, ...props }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 700);
  };

  return (
    <Button
      size="icon"
      className={cn("size-7 !bg-slate-700 !text-accent !rounded-md", className)}
      disabled={isCopied}
      onClick={copy}
      aria-label="Copy"
      {...props}
    >
      <span className="sr-only">Copy</span>
      {isCopied ? <Checks className="text-green-400" /> : <ClipboardText />}
    </Button>
  );
}
