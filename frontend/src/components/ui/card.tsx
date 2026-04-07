import React from "react";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`border border-gray-200 rounded-lg shadow-sm p-4 bg-white ${className}`}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";
