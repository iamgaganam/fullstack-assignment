import type { ReactNode, HTMLAttributes } from "react";
import { createContext, useContext, useState } from "react";

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(open);
  const isControlled = onOpenChange !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <DialogContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog component");
  }
  return context;
}

export interface DialogTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function DialogTrigger({ children, ...props }: DialogTriggerProps) {
  const { setOpen } = useDialog();
  return (
    <button onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  );
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function DialogContent({
  children,
  className = "",
  ...props
}: DialogContentProps) {
  const { open, setOpen } = useDialog();

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black opacity-50"
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/60 dark:text-white ${className}`}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function DialogHeader({ className = "", ...props }: DialogHeaderProps) {
  return (
    <div
      className={`space-y-2 border-b border-gray-200 p-6 dark:border-slate-700 ${className}`}
      {...props}
    />
  );
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export function DialogTitle({ className = "", ...props }: DialogTitleProps) {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight dark:text-white ${className}`}
      {...props}
    />
  );
}

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export function DialogDescription({
  className = "",
  ...props
}: DialogDescriptionProps) {
  return (
    <p
      className={`text-sm text-gray-600 dark:text-slate-400 ${className}`}
      {...props}
    />
  );
}

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function DialogFooter({ className = "", ...props }: DialogFooterProps) {
  return (
    <div
      className={`flex justify-end gap-2 border-t border-gray-200 p-6 dark:border-slate-700 ${className}`}
      {...props}
    />
  );
}
