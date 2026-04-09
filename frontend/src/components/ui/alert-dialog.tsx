import type { ReactNode, HTMLAttributes } from "react";
import { createContext, useContext, useState } from "react";

interface AlertDialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(
  undefined,
);

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function AlertDialog({
  open = false,
  onOpenChange,
  children,
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open);
  const isControlled = onOpenChange !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <AlertDialogContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

function useAlertDialog() {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error(
      "AlertDialog components must be used within an AlertDialog component",
    );
  }
  return context;
}

export interface AlertDialogTriggerProps
  extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function AlertDialogTrigger({
  children,
  ...props
}: AlertDialogTriggerProps) {
  const { setOpen } = useAlertDialog();
  return (
    <button onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  );
}

export interface AlertDialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AlertDialogContent({
  children,
  className = "",
  ...props
}: AlertDialogContentProps) {
  const { open } = useAlertDialog();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black opacity-50" />
      <div
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/60 dark:text-white ${className}`}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export interface AlertDialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function AlertDialogHeader({
  className = "",
  ...props
}: AlertDialogHeaderProps) {
  return (
    <div
      className={`space-y-2 border-b border-gray-200 p-6 dark:border-slate-700 ${className}`}
      {...props}
    />
  );
}

export interface AlertDialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export function AlertDialogTitle({
  className = "",
  ...props
}: AlertDialogTitleProps) {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight dark:text-white ${className}`}
      {...props}
    />
  );
}

export interface AlertDialogDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export function AlertDialogDescription({
  className = "",
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <p
      className={`text-sm text-gray-600 dark:text-slate-400 ${className}`}
      {...props}
    />
  );
}

export interface AlertDialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function AlertDialogFooter({
  className = "",
  ...props
}: AlertDialogFooterProps) {
  return (
    <div
      className={`flex justify-end gap-2 border-t border-gray-200 p-6 dark:border-slate-700 ${className}`}
      {...props}
    />
  );
}

export interface AlertDialogActionProps
  extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function AlertDialogAction({
  children,
  ...props
}: AlertDialogActionProps) {
  return (
    <button
      className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
      {...props}
    >
      {children}
    </button>
  );
}

export interface AlertDialogCancelProps
  extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function AlertDialogCancel({
  children,
  ...props
}: AlertDialogCancelProps) {
  const { setOpen } = useAlertDialog();
  return (
    <button
      className="bg-gray-200 text-gray-900 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors"
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
}
