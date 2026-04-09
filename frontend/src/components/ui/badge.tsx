import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const variantStyles = {
  default: "bg-blue-600 text-white dark:bg-blue-700 dark:text-blue-50",
  secondary: "bg-gray-200 text-gray-900 dark:bg-slate-700 dark:text-slate-100",
  destructive: "bg-red-600 text-white dark:bg-red-900 dark:text-red-100",
  outline:
    "border border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-100",
};

export function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
        variantStyles[variant]
      } ${className}`}
      {...props}
    />
  );
}
