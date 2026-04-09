import type { ReactNode, HTMLAttributes } from "react";
import React, { createContext, useContext, useState } from "react";

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Sheet({ open = false, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = useState(open);
  const isControlled = onOpenChange !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <SheetContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet component");
  }
  return context;
}

export interface SheetTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
}

export function SheetTrigger({ children, asChild }: SheetTriggerProps) {
  const { setOpen } = useSheet();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler;
    }>;

    return React.cloneElement(child, {
      onClick: (event) => {
        child.props.onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(true);
        }
      },
    });
  }

  return <button onClick={() => setOpen(true)}>{children}</button>;
}

export interface SheetContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function SheetContent({
  children,
  className = "",
  side = "right",
  ...props
}: SheetContentProps) {
  const { open, setOpen } = useSheet();

  if (!open) return null;

  const sideClasses = {
    top: "top-0 left-0 right-0 h-auto",
    right: "right-0 top-0 h-full w-full max-w-sm",
    bottom: "bottom-0 left-0 right-0 h-auto",
    left: "left-0 top-0 h-full w-full max-w-sm",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black opacity-50"
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed z-50 border border-gray-200 bg-white shadow-lg transition-transform dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/60 dark:text-white ${
          sideClasses[side]
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export interface SheetCloseProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  asChild?: boolean;
}

export function SheetClose({ children, asChild, ...props }: SheetCloseProps) {
  const { setOpen } = useSheet();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler;
    }>;

    return React.cloneElement(child, {
      onClick: (event) => {
        child.props.onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(false);
        }
      },
    });
  }

  return (
    <button onClick={() => setOpen(false)} {...props}>
      {children}
    </button>
  );
}
