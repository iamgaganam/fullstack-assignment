import { Link } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  Users,
  Buildings,
  ChartBar,
  ArrowUpRight,
  Code,
} from "@phosphor-icons/react";
import { Toaster, toast } from "sonner";

import { departmentAPI, employeeAPI } from "@/api";
import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FooterProps {
  isDark: boolean;
}

export function Footer({ isDark }: FooterProps) {
  const [stats, setStats] = useState<
    Array<{ value: string; label: string; icon: ReactNode }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate a brief delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(
        `Newsletter subscription for ${email} has been added to our mailing list.`,
      );
      setEmail("");
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const productLinks = [
    { label: "Dashboard", to: "/" },
    { label: "Departments", to: "/departments" },
    { label: "Employees", to: "/employees" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [employees, departments] = await Promise.all([
          employeeAPI.getAll(),
          departmentAPI.getAll(),
        ]);

        const totalEmployees = employees.length;
        const totalDepartments = departments.length;
        const avgPerDept =
          totalDepartments > 0
            ? (totalEmployees / totalDepartments).toFixed(1)
            : "0";

        setStats([
          {
            value: totalEmployees.toString(),
            label: "Total Employees",
            icon: <Users size={18} weight="fill" />,
          },
          {
            value: totalDepartments.toString(),
            label: "Departments",
            icon: <Buildings size={18} weight="fill" />,
          },
          {
            value: avgPerDept,
            label: "Avg per Dept",
            icon: <ChartBar size={18} weight="fill" />,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);

        setStats([
          {
            value: "—",
            label: "Total Employees",
            icon: <Users size={18} weight="fill" />,
          },
          {
            value: "—",
            label: "Departments",
            icon: <Buildings size={18} weight="fill" />,
          },
          {
            value: "—",
            label: "Avg per Dept",
            icon: <ChartBar size={18} weight="fill" />,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <footer
      className={`relative w-full overflow-hidden border-t animate-fade-in ${
        isDark
          ? "border-white/10 bg-slate-950 text-white"
          : "border-slate-200 bg-slate-50 text-slate-900"
      }`}
    >
      <Toaster position="top-right" theme={isDark ? "dark" : "light"} />
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -left-32 top-0 h-96 w-96 rounded-full blur-3xl ${
            isDark ? "bg-blue-600/8" : "bg-blue-400/10"
          }`}
        />
        <div
          className={`absolute -right-32 bottom-0 h-80 w-80 rounded-full blur-3xl ${
            isDark ? "bg-violet-600/8" : "bg-violet-400/10"
          }`}
        />
        <div
          className={`absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
            isDark ? "bg-indigo-600/5" : "bg-indigo-400/8"
          }`}
        />
      </div>

      <div className="relative w-full">
        {/* Top CTA band */}
        <div
          className={`w-full border-b ${
            isDark ? "border-white/6" : "border-slate-200/60"
          }`}
        >
          <div className="px-3 sm:px-4 md:px-6 lg:px-10 2xl:px-20 py-6 sm:py-8 md:py-10">
            <div
              className={`animate-slide-up flex flex-col gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border p-4 sm:p-6 md:p-8 lg:p-10 md:flex-row md:items-center md:justify-between ${
                isDark
                  ? "border-white/8 bg-gradient-to-br from-white/3 to-white/1"
                  : "border-slate-200/80 bg-white shadow-sm"
              }`}
            >
              <div className="max-w-lg">
                <Badge
                  className={`mb-4 rounded-full border px-3 py-1 text-xs font-medium ${
                    isDark
                      ? "border-blue-500/25 bg-blue-500/10 text-blue-400"
                      : "border-blue-200 bg-blue-50 text-blue-600"
                  }`}
                >
                  Workforce Platform
                </Badge>

                <h3
                  className={`text-xl sm:text-2xl font-bold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Ready to transform your HR management?
                </h3>

                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Join thousands of organizations using NexusHR to streamline
                  operations.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:gap-3 md:w-auto md:shrink-0 sm:flex-row">
                <Button
                  asChild
                  className="w-full sm:w-auto rounded-full border-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500"
                >
                  <Link to="/employees">Start exploring</Link>
                </Button>

                <Button
                  variant="outline"
                  asChild
                  className={`w-full sm:w-auto gap-2 rounded-full px-4 sm:px-6 ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Link to="/">
                    View demo
                    <ArrowUpRight size={14} weight="bold" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-10 2xl:px-20 py-6 sm:py-8 md:py-10">
          <div className="grid gap-8 sm:gap-10 md:gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.4fr]">
            {/* Brand column */}
            <div className="animate-slide-in animate-delay-100">
              <Link to="/" className="group flex items-center gap-2 sm:gap-3">
                <img
                  src={logo}
                  alt="NexusHR Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow-md transition-all duration-300 group-hover:drop-shadow-lg"
                />
                <div>
                  <div
                    className={`text-sm font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    NexusHR
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    HR Management
                  </div>
                </div>
              </Link>

              <p
                className={`mt-3 sm:mt-5 text-sm leading-7 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Empowering organizations with intelligent workforce management.
                Streamline HR operations and unlock your team's potential.
              </p>

              {/* Stats row */}
              <div
                className={`mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 ${
                  isDark
                    ? "border-white/8 bg-white/3"
                    : "border-slate-200 bg-white"
                }`}
              >
                {isLoading
                  ? Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="text-center">
                          <div
                            className={`mx-auto h-5 w-6 animate-pulse rounded ${
                              isDark ? "bg-white/10" : "bg-slate-200"
                            }`}
                          />
                          <div
                            className={`mx-auto mt-1 sm:mt-2 h-2 animate-pulse rounded ${
                              isDark ? "bg-white/10" : "bg-slate-200"
                            }`}
                          />
                        </div>
                      ))
                  : stats.map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="mb-0.5 sm:mb-1 flex justify-center">
                          <div
                            className={`${
                              isDark ? "text-blue-400" : "text-blue-600"
                            }`}
                          >
                            {s.icon}
                          </div>
                        </div>

                        <div
                          className={`text-sm sm:text-base font-bold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {s.value}
                        </div>

                        <div
                          className={`mt-0.5 text-[9px] sm:text-[10px] ${
                            isDark ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {s.label}
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Product links */}
            <div className="animate-slide-in animate-delay-200">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-500">
                Quick Links
              </h4>

              <ul className="flex flex-col gap-3">
                {productLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      onClick={scrollToTop}
                      className={`text-base transition-colors duration-200 hover:underline underline-offset-4 ${
                        isDark
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="animate-slide-in animate-delay-300 md:col-span-2 lg:col-span-1">
              <h4 className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-blue-500">
                Stay connected
              </h4>

              <h3
                className={`text-lg font-bold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Get the latest updates
              </h3>

              <p
                className={`mt-2 sm:mt-2.5 text-sm leading-6 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Subscribe to receive product updates, feature releases, and HR
                insights delivered to your inbox.
              </p>

              <div className="mt-3 sm:mt-4 flex flex-col gap-2">
                <div className="relative">
                  <EnvelopeSimple
                    size={15}
                    className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  />

                  <Input
                    type="email"
                    placeholder="your@email.com"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    disabled={isSubmitting}
                    className={`h-9 sm:h-10 rounded-lg sm:rounded-xl pl-8 sm:pl-9 text-sm ${
                      isDark
                        ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 disabled:opacity-60"
                        : "border-slate-200 bg-white placeholder:text-slate-400 focus:border-blue-400 disabled:opacity-60"
                    }`}
                  />
                </div>

                <Button
                  onClick={handleSubscribe}
                  disabled={isSubmitting}
                  className={`h-9 sm:h-10 w-full rounded-lg sm:rounded-xl border-0 text-sm font-medium shadow-md shadow-blue-500/20 ${
                    isSubmitting
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                  }`}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>

              <p
                className={`mt-2 text-[10px] sm:text-[11px] ${
                  isDark ? "text-slate-600" : "text-slate-400"
                }`}
              >
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`border-t px-3 sm:px-4 md:px-6 lg:px-10 2xl:px-20 pb-3 sm:pb-4 pt-2.5 sm:pt-3 ${
            isDark
              ? "border-white/5 bg-slate-900/40"
              : "border-slate-200/40 bg-slate-100/50"
          }`}
        >
          <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p
              className={`flex flex-wrap items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs ${
                isDark ? "text-slate-500" : "text-slate-500"
              }`}
            >
              <span>© 2026 NexusHR.</span>

              <span className="inline-flex items-center gap-1">
                <Code
                  size={13}
                  weight="bold"
                  className={isDark ? "text-blue-400" : "text-blue-600"}
                />
                <span>Developed by</span>
              </span>

              <a
                href="https://iamgaganam.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-0.5 font-semibold transition-colors duration-200 hover:underline underline-offset-2 ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                <span>Gagana Methmal</span>
                <ArrowUpRight size={10} weight="bold" />
              </a>
            </p>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <a
                href="https://github.com/iamgaganam"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className={`inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border transition-all duration-200 ${
                  isDark
                    ? "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <GithubLogo size={14} weight="duotone" />
              </a>

              <a
                href="https://www.linkedin.com/in/gagana-methmal/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className={`inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border transition-all duration-200 ${
                  isDark
                    ? "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <LinkedinLogo size={14} weight="duotone" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
