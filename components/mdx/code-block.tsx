"use client";

import { type ComponentPropsWithoutRef, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Mermaid } from "./mermaid";

type PreProps = ComponentPropsWithoutRef<"pre"> & {
  // rehype-pretty-code adds these data attributes
  "data-language"?: string;
  "data-theme"?: string;
};

/**
 * CodeBlock — wraps <pre> output from rehype-pretty-code.
 * Adds: language badge, copy button, line numbers via CSS.
 */
export function CodeBlock({ children, "data-language": language, ...props }: PreProps) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (language === "mermaid") {
    return <Mermaid>{children}</Mermaid>;
  }

  return (
    <figure
      className="group relative my-6 overflow-hidden rounded-xl border border-border bg-[--shiki-light-bg] dark:bg-[--shiki-dark-bg]"
      data-language={language}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
        <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {language ?? "code"}
        </span>
        <button
          onClick={copy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre
        ref={ref}
        className="overflow-x-auto p-4 text-sm leading-relaxed"
        {...props}
      >
        {children}
      </pre>
    </figure>
  );
}
