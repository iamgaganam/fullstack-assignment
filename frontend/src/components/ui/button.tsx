import React from "react";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className = "", ...props }, ref) => (
  <button
    ref={ref}
    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${className}`}
    {...props}
  >
    {children}
  </button>
));

Button.displayName = "Button";
