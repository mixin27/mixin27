import { type ReactNode } from "react";
import {
  InfoIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightbulbIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "success" | "error" | "tip";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
  className?: string;
}

const config: Record<
  CalloutType,
  { icon: typeof InfoIcon; className: string; iconClass: string; defaultTitle: string }
> = {
  info: {
    icon: InfoIcon,
    className: "border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20",
    iconClass: "text-blue-500",
    defaultTitle: "Note",
  },
  warning: {
    icon: AlertTriangleIcon,
    className: "border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20",
    iconClass: "text-amber-500",
    defaultTitle: "Warning",
  },
  success: {
    icon: CheckCircleIcon,
    className: "border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20",
    iconClass: "text-green-500",
    defaultTitle: "Success",
  },
  error: {
    icon: XCircleIcon,
    className: "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20",
    iconClass: "text-red-500",
    defaultTitle: "Error",
  },
  tip: {
    icon: LightbulbIcon,
    className: "border-purple-200 bg-purple-50/50 dark:border-purple-900/50 dark:bg-purple-950/20",
    iconClass: "text-purple-500",
    defaultTitle: "Tip",
  },
};

/**
 * Callout — Mintlify-style callout boxes.
 *
 * Usage in MDX:
 * <Callout type="warning" title="Breaking change">
 *   This API was removed in v3.
 * </Callout>
 */
export function Callout({
  type = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const { icon: Icon, className: variantClass, iconClass, defaultTitle } = config[type];
  const displayTitle = title ?? defaultTitle;

  return (
    <div
      role="note"
      className={cn(
        "my-6 flex gap-3 rounded-xl border p-4",
        variantClass,
        className
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconClass)} aria-hidden />
      <div className="min-w-0 flex-1">
        {displayTitle && (
          <p className="mb-1 text-sm font-semibold text-foreground">{displayTitle}</p>
        )}
        <div className="text-sm leading-relaxed text-muted-foreground [&>p]:mt-0 [&>p:not(:first-child)]:mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
