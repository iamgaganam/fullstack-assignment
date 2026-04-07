import React from "react";

export const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical";
  }
>(({ className = "", orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    className={`${
      orientation === "vertical"
        ? "h-full w-px bg-gray-200"
        : "h-px w-full bg-gray-200"
    } ${className}`}
    {...props}
  />
));

Separator.displayName = "Separator";
