import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react";

interface PageHeaderProps {
  isDark: boolean;
  icon: React.ReactNode;
  badge: string;
  title: string;
  subtitle: string;
  onAddClick: () => void;
  addButtonLabel: string;
}

export function PageHeader({
  isDark,
  icon,
  badge,
  title,
  subtitle,
  onAddClick,
  addButtonLabel,
}: PageHeaderProps) {
  const heading = isDark ? "text-white" : "text-slate-900";
  const body = isDark ? "text-slate-400" : "text-slate-600";

  return (
    <section className="relative overflow-hidden animate-slide-up">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-20 top-16 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
        {isDark && (
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        )}
      </div>

      <div className="relative w-full px-4 pb-10 pt-12 sm:px-6 lg:px-10 lg:pt-14 2xl:px-20">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div
              className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${
                isDark
                  ? "border-blue-500/20 bg-blue-500/8 text-blue-300"
                  : "border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              {icon}
              <span className="font-medium">{badge}</span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] ${heading}`}
            >
              {title}
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                {subtitle}
              </span>
            </h1>

            <p className={`mt-4 max-w-xl text-base leading-8 ${body}`}>
              Create, edit, and manage your records in a clean, focused
              workspace.
            </p>
          </div>

          <Button
            onClick={onAddClick}
            className="rounded-full px-6 h-11 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-500/20 text-white font-medium"
          >
            <Plus size={17} weight="bold" />
            {addButtonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
