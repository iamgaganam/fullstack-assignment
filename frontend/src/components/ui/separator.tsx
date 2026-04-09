import type { HTMLAttributes } from "react";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  orientation = "horizontal",
  className = "",
  ...props
}: SeparatorProps) {
  return (
    <div
      className={`shrink-0 bg-gray-200 dark:bg-slate-700 ${
        orientation === "vertical" ? "h-full w-px" : "h-px w-full"
      } ${className}`}
      {...props}
    />
  );
}
