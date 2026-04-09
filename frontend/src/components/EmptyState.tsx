import { Button } from "@/components/ui/button";
import { X, Plus } from "@phosphor-icons/react";

interface EmptyStateProps {
  isDark: boolean;
  icon: React.ReactNode;
  title: string;
  message: string;
  searchTerm?: string;
  onAddClick?: () => void;
  onClearSearch?: () => void;
  addButtonLabel?: string;
}

export function EmptyState({
  isDark,
  icon,
  title,
  message,
  searchTerm = "",
  onAddClick,
  onClearSearch,
  addButtonLabel = "Add",
}: EmptyStateProps) {
  const heading = isDark ? "text-white" : "text-slate-900";
  const body = isDark ? "text-slate-400" : "text-slate-600";
  const muted = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center">
      <div
        className={`mb-3 sm:mb-5 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl ${
          isDark ? "bg-white/5" : "bg-slate-100"
        }`}
      >
        <div className={muted}>{icon}</div>
      </div>
      <h3 className={`text-base sm:text-lg font-semibold ${heading}`}>
        {title}
      </h3>
      <p className={`mt-2 max-w-sm text-xs sm:text-sm leading-7 ${body}`}>
        {message}
      </p>
      {!searchTerm && onAddClick && (
        <Button
          onClick={onAddClick}
          className="mt-4 sm:mt-6 rounded-full px-4 sm:px-6 h-9 sm:h-11 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white text-sm"
        >
          <Plus size={16} weight="bold" />
          {addButtonLabel}
        </Button>
      )}
      {searchTerm && onClearSearch && (
        <Button
          variant="outline"
          onClick={onClearSearch}
          className={`mt-3 sm:mt-5 rounded-full px-4 sm:px-5 h-9 sm:h-11 gap-2 text-sm ${
            isDark ? "border-white/10 bg-white/5 text-white" : ""
          }`}
        >
          <X size={14} />
          Clear search
        </Button>
      )}
    </div>
  );
}
