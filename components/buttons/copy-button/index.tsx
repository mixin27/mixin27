import { CSSProperties, HTMLAttributes, useState } from "react";
import clsx from "clsx";
import { Clipboard, ClipboardCheck } from "lucide-react";

const buttonClasses =
  "flex items-center text-xs font-medium text-white rounded";

type Props = {
  text: string;
  className?: HTMLAttributes<CSSProperties>;
};

const CopyButton = ({ text, className }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  };

  const Icon = isCopied ? ClipboardCheck : Clipboard;
  return (
    <button
      disabled={isCopied}
      onClick={copy}
      className={clsx(buttonClasses, className)}
    >
      <Icon className="mr-1 h-4 w-4" />
      <span>{isCopied ? "Copied!" : "Copy"}</span>
    </button>
  );
};

export default CopyButton;
