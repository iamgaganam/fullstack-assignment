import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { createPortal } from "react-dom";

interface SelectContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export function Select({ value = "", onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isControlled = onValueChange !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = (newValue: string) => {
    if (isControlled) {
      onValueChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value: currentValue,
        setValue,
        triggerRef,
        contentRef,
      }}
    >
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
}

function useSelect() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select component");
  }
  return context;
}

export interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function SelectTrigger({
  children,
  className = "",
  onClick,
  ...props
}: SelectTriggerProps) {
  const { setOpen, open, triggerRef } = useSelect();

  return (
    <button
      type="button"
      ref={triggerRef}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(!open);
        }
      }}
      className={`flex h-10 w-full items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-base placeholder:text-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${className}`}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      <CaretDown
        size={16}
        className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export function SelectValue({
  placeholder = "Select an option",
  className = "",
  children,
  ...props
}: SelectValueProps) {
  const { value } = useSelect();
  return (
    <span className={`block truncate ${className}`} {...props}>
      {children || value || placeholder}
    </span>
  );
}

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function SelectContent({
  children,
  className = "",
  ...props
}: SelectContentProps) {
  const { open, setOpen, triggerRef, contentRef } = useSelect();
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);

  useLayoutEffect(() => {
    // Using useLayoutEffect for DOM measurements is correct; setState here synchronously applies position
    if (!open || !triggerRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, 280);
      const availableBottom = window.innerHeight - rect.bottom - 20;
      const maxHeight = Math.min(280, Math.max(160, availableBottom));
      const left = Math.min(
        Math.max(16, rect.left),
        window.innerWidth - width - 16,
      );

      setPosition({
        top: rect.bottom + 8,
        left,
        width,
        maxHeight,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !contentRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen, contentRef, triggerRef]);

  if (!open || !position || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={contentRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: position.maxHeight,
      }}
      className={`z-[80] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/60 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export function SelectItem({
  value,
  children,
  className = "",
  ...props
}: SelectItemProps) {
  const { setValue, value: selectedValue } = useSelect();
  const isSelected = selectedValue === value;

  return (
    <div
      onClick={() => setValue(value)}
      className={`flex cursor-pointer select-none items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors hover:bg-blue-50 dark:hover:bg-slate-800 ${
        isSelected
          ? "bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-400"
          : "dark:text-slate-200"
      } ${className}`}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {isSelected && (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          <Check size={12} weight="bold" />
        </span>
      )}
    </div>
  );
}
