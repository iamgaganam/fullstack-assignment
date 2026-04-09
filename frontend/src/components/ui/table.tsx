import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`border-b border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800 ${className}`}
      {...props}
    />
  );
}

export function TableBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`dark:text-slate-200 ${className}`} {...props} />;
}

export function TableFooter({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={`border-t border-gray-200 bg-gray-50 font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 ${className}`}
      {...props}
    />
  );
}

export function TableRow({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-b border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 ${className}`}
      {...props}
    />
  );
}

export function TableHead({
  className = "",
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-slate-300 ${className}`}
      {...props}
    />
  );
}

export function TableCell({
  className = "",
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`px-4 py-3 align-middle dark:text-slate-200 ${className}`}
      {...props}
    />
  );
}

export function TableCaption({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={`mt-4 text-sm text-gray-600 dark:text-slate-400 ${className}`}
      {...props}
    />
  );
}
