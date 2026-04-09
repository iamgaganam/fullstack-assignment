import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  isDark: boolean;
  count?: number;
  variant?: "row" | "large";
}

export function LoadingState({
  isDark,
  count = 6,
  variant = "row",
}: LoadingStateProps) {
  const height = variant === "large" ? "h-16" : "h-12 sm:h-14";
  const spacing = variant === "large" ? "space-y-3" : "space-y-2 sm:space-y-3";

  return (
    <div className={`${spacing} p-3 sm:p-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={`${height} w-full rounded-lg sm:rounded-xl ${isDark ? "bg-white/5" : ""}`}
        />
      ))}
    </div>
  );
}
