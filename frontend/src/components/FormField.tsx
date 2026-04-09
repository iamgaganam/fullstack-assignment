import { Label } from "@/components/ui/label";
import { X } from "@phosphor-icons/react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  isDark?: boolean;
}

export function FormField({
  label,
  error,
  children,
  isDark = false,
}: FormFieldProps) {
  const heading = isDark ? "text-white" : "text-slate-900";

  return (
    <div className="grid gap-2.5">
      <Label className={`text-sm font-medium ${heading}`}>{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X size={12} /> {error}
        </p>
      )}
    </div>
  );
}
