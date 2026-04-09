import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface SearchBarProps {
  isDark: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export function SearchBar({
  isDark,
  searchTerm,
  onSearchChange,
  placeholder = "Search…",
}: SearchBarProps) {
  const muted = isDark ? "text-slate-500" : "text-slate-400";
  const card = isDark
    ? "border-white/8 bg-white/3"
    : "border-slate-200 bg-white shadow-sm";

  return (
    <div
      className={`flex-1 flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3 ${card}`}
    >
      <MagnifyingGlass size={15} className={muted} />
      <input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent text-xs sm:text-sm outline-none ${
          isDark
            ? "text-white placeholder:text-slate-600"
            : "text-slate-900 placeholder:text-slate-400"
        }`}
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange("")}
          className={`rounded-full p-0.5 ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
