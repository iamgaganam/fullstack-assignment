import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { departmentAPI, employeeAPI } from "@/api";
import type {
  Stats,
  Employee,
  Department,
  DepartmentPayroll,
  PageProps,
} from "@/types";
import {
  ArrowRight,
  ArrowUpRight,
  Buildings,
  Briefcase,
  ChartLine,
  ChartBar,
  CurrencyDollar,
  Sparkle,
  SquaresFour,
  Users,
  CheckCircle,
  TrendUp,
  Lightning,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardProps = PageProps;

function currency(value: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

const COLOR_PALETTE = [
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-fuchsia-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-sky-500 to-blue-500",
  "from-indigo-500 to-purple-500",
  "from-green-500 to-emerald-500",
];

export function Dashboard({ isDark }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    totalDepartments: 0,
    averageSalary: 0,
    totalSalary: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [prevStats, setPrevStats] = useState<Stats | null>(null);
  const [departmentPayroll, setDepartmentPayroll] = useState<
    DepartmentPayroll[]
  >([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const [fetchedEmployees, fetchedDepartments] = await Promise.all([
          employeeAPI.getAll(),
          departmentAPI.getAll(),
        ]);

        const totalSalary = fetchedEmployees.reduce(
          (sum: number, emp: Employee) => sum + (emp.salary || 0),
          0,
        );
        const averageSalary =
          fetchedEmployees.length > 0
            ? totalSalary / fetchedEmployees.length
            : 0;

        // Calculate payroll by department
        const deptPayrollMap: { [key: number]: number } = {};
        fetchedEmployees.forEach((emp: Employee) => {
          if (emp.departmentId !== undefined && emp.departmentId !== null) {
            deptPayrollMap[emp.departmentId] =
              (deptPayrollMap[emp.departmentId] || 0) + (emp.salary || 0);
          }
        });

        // Create department payroll array with percentages
        const deptPayrollArray: DepartmentPayroll[] = fetchedDepartments
          .map((dept: Department, index: number) => ({
            departmentId: dept.departmentId || 0,
            departmentName:
              dept.departmentName || `Department ${dept.departmentId}`,
            totalPayroll: deptPayrollMap[dept.departmentId || 0] || 0,
            percentage: 0, // Will be calculated after
            color: COLOR_PALETTE[index % COLOR_PALETTE.length],
          }))
          .sort(
            (a: DepartmentPayroll, b: DepartmentPayroll) =>
              b.totalPayroll - a.totalPayroll,
          )
          .map((dept: DepartmentPayroll) => ({
            ...dept,
            percentage:
              totalSalary > 0
                ? Math.round((dept.totalPayroll / totalSalary) * 100)
                : 0,
          }));

        setDepartmentPayroll(deptPayrollArray);

        const newStats = {
          totalEmployees: fetchedEmployees.length,
          totalDepartments: fetchedDepartments.length,
          averageSalary: Math.round(averageSalary),
          totalSalary: Math.round(totalSalary),
        };
        setStats(newStats);
        localStorage.setItem("dashboardStats", JSON.stringify(newStats));
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const stored = localStorage.getItem("dashboardStats");
    if (stored) {
      setPrevStats(JSON.parse(stored));
    }
    loadStats();
  }, []);

  const calculateChange = (
    current: number,
    previous: number | undefined,
  ): { change: string; positive: boolean | null } => {
    if (!previous || previous === 0) return { change: "New", positive: true };
    const percentChange = ((current - previous) / previous) * 100;
    const isPositive = percentChange > 0;
    return {
      change: `${isPositive ? "+" : ""}${percentChange.toFixed(1)}%`,
      positive: percentChange !== 0 ? isPositive : null,
    };
  };

  const employeeChange = calculateChange(
    stats.totalEmployees,
    prevStats?.totalEmployees,
  );
  const deptChange = calculateChange(
    stats.totalDepartments,
    prevStats?.totalDepartments,
  );
  const salaryChange = calculateChange(
    stats.averageSalary,
    prevStats?.averageSalary,
  );
  const payrollChange = calculateChange(
    stats.totalSalary,
    prevStats?.totalSalary,
  );

  const formattedStats = useMemo(
    () => [
      {
        label: "Total employees",
        value: stats.totalEmployees.toLocaleString(),
        icon: Users,
        color: "blue",
        gradient: "from-blue-500 to-cyan-500",
        bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
        hint: "Active workforce records",
        change: employeeChange.change,
        positive: employeeChange.positive,
      },
      {
        label: "Departments",
        value: stats.totalDepartments.toLocaleString(),
        icon: SquaresFour,
        color: "violet",
        gradient: "from-violet-500 to-purple-500",
        bg: isDark ? "bg-violet-500/10" : "bg-violet-50",
        hint: "Business units tracked",
        change: deptChange.change,
        positive: deptChange.positive,
      },
      {
        label: "Average salary",
        value: currency(stats.averageSalary),
        icon: ChartLine,
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500",
        bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
        hint: "Mean payroll value",
        change: salaryChange.change,
        positive: salaryChange.positive,
      },
      {
        label: "Total payroll",
        value: currency(stats.totalSalary),
        icon: CurrencyDollar,
        color: "amber",
        gradient: "from-amber-500 to-orange-500",
        bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
        hint: "Current salary total",
        change: payrollChange.change,
        positive: payrollChange.positive,
      },
    ],
    [stats, isDark, prevStats],
  );

  const overviewCards = [
    {
      title: "Department management",
      description:
        "Create, update, and organize your departments with a clean, focused workflow. Keep business units structured and easy to navigate.",
      icon: Buildings,
      href: "/departments",
      points: [
        "Create departments in seconds",
        "Edit codes and names instantly",
        "Keep org structure organized",
      ],
      buttonLabel: "Open departments",
      gradient: "from-blue-500 to-cyan-500",
      ringColor: isDark ? "ring-blue-500/20" : "ring-blue-200",
      accentBg: isDark ? "bg-blue-500/8" : "bg-blue-50/80",
    },
    {
      title: "Employee management",
      description:
        "Manage employee profiles, department assignments, salaries, and records in a focused, premium workspace built for speed.",
      icon: Briefcase,
      href: "/employees",
      points: [
        "Add and edit employee records",
        "Track salaries with precision",
        "Assign departments effortlessly",
      ],
      buttonLabel: "Open employees",
      gradient: "from-violet-500 to-fuchsia-500",
      ringColor: isDark ? "ring-violet-500/20" : "ring-violet-200",
      accentBg: isDark ? "bg-violet-500/8" : "bg-violet-50/80",
    },
  ];

  const utilization =
    stats.totalDepartments > 0
      ? Math.round(stats.totalEmployees / stats.totalDepartments)
      : 0;

  const heading = isDark ? "text-white" : "text-slate-900";
  const body = isDark ? "text-slate-400" : "text-slate-600";
  const muted = isDark ? "text-slate-500" : "text-slate-400";
  const card = isDark
    ? "border-white/8 bg-white/3"
    : "border-slate-200 bg-white shadow-sm";

  return (
    <main
      className={`min-h-screen w-full ${
        isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"
      }`}
    >
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden animate-slide-up">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -right-20 top-16 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-500/8 blur-3xl" />
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

        <div className="relative w-full px-4 pb-12 pt-12 sm:px-6 lg:px-10 lg:pb-16 lg:pt-16 2xl:px-20">
          <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            {/* Left — text */}
            <div className="max-w-2xl">
              <div
                className="mb-5 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-sm
                  ${isDark ? 'border-blue-500/20 bg-blue-500/8 text-blue-300' : 'border-blue-200 bg-blue-50 text-blue-700'}"
              >
                <Sparkle size={14} weight="fill" className="text-blue-500" />
                <span
                  className={`font-medium text-sm ${isDark ? "text-blue-300" : "text-blue-700"}`}
                >
                  Dashboard
                </span>
              </div>

              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] ${heading}`}
              >
                Your workforce,
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  fully in view.
                </span>
              </h1>

              <p className={`mt-5 text-base leading-8 sm:text-lg ${body}`}>
                Real-time stats, department health, and payroll data — all in
                one clean, focused workspace built for modern teams.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-7 h-12 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-500/20 text-white font-semibold"
                >
                  <Link to="/employees">
                    Manage employees
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className={`rounded-full px-7 h-12 font-medium ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Link to="/departments">View departments</Link>
                </Button>
              </div>

              {/* Quick trust items */}
              <div className={`mt-7 flex flex-wrap gap-5 text-sm ${muted}`}>
                {["Live Data", "CRUD Ready"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle
                      size={14}
                      className="text-emerald-500"
                      weight="fill"
                    />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — system overview card */}
            <Card
              className={`overflow-hidden rounded-2xl border shadow-xl ${
                isDark
                  ? "border-white/10 bg-slate-900/80"
                  : "border-slate-200 bg-white"
              }`}
            >
              <CardHeader
                className={`pb-4 border-b ${isDark ? "border-white/8" : "border-slate-100"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardDescription className={muted}>
                      Operational Snapshot
                    </CardDescription>
                    <CardTitle className={`text-xl font-bold ${heading}`}>
                      System Overview
                    </CardTitle>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25">
                    <ChartBar size={20} weight="fill" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 p-5">
                <div className="grid gap-3 sm:grid-cols-2 mt-4">
                  <QuickInsight
                    isDark={isDark}
                    label="Employees / dept"
                    value={utilization > 0 ? utilization.toString() : "—"}
                    icon={
                      <TrendUp
                        size={14}
                        className="text-blue-500"
                        weight="fill"
                      />
                    }
                  />
                  <QuickInsight
                    isDark={isDark}
                    label="Payroll status"
                    value={
                      stats.totalEmployees > 0 && stats.totalSalary > 0
                        ? "Healthy"
                        : "No data"
                    }
                    icon={
                      <CheckCircle
                        size={14}
                        className="text-emerald-500"
                        weight="fill"
                      />
                    }
                  />
                </div>

                <Separator className={isDark ? "bg-white/8" : "bg-slate-100"} />

                <div className="space-y-3">
                  {[
                    "Live employee & department stats",
                    "Full CRUD across all records",
                    "Payroll insights at a glance",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 shrink-0" />
                      <p className={`text-sm ${body}`}>{item}</p>
                    </div>
                  ))}
                </div>

                <div
                  className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
                    isDark
                      ? "border-emerald-500/20 bg-emerald-500/8"
                      : "border-emerald-100 bg-emerald-50"
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <p
                    className={`text-xs font-medium ${isDark ? "text-emerald-400" : "text-emerald-700"}`}
                  >
                    All systems operational
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── STAT CARDS ────────────────────────────────────── */}
      <section className="w-full px-3 sm:px-4 md:px-6 lg:px-10 2xl:px-20 pb-10 animate-slide-up animate-delay-100">
        <div className="grid gap-3 sm:gap-4 md:gap-5 xs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className={`rounded-2xl border ${
                    isDark
                      ? "border-white/8 bg-white/3"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <CardContent className="space-y-4 p-6">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                    <Skeleton className="h-4 w-32 rounded-lg" />
                  </CardContent>
                </Card>
              ))
            : formattedStats.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.label}
                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${card} ${
                      isDark
                        ? "hover:shadow-black/30"
                        : "hover:shadow-slate-200"
                    }`}
                  >
                    <CardContent className="py-4 sm:py-5 md:py-6 px-4 sm:px-5 md:px-6">
                      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5">
                        <div
                          className={`flex h-10 sm:h-11 md:h-12 w-10 sm:w-11 md:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-md`}
                        >
                          <Icon
                            size={18}
                            weight="fill"
                            className="sm:w-6 sm:h-6"
                          />
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-semibold rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 ${
                            item.positive === true
                              ? isDark
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-emerald-50 text-emerald-600"
                              : item.positive === false
                                ? isDark
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-red-50 text-red-600"
                                : isDark
                                  ? "bg-slate-500/10 text-slate-400"
                                  : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.change}
                        </span>
                      </div>
                      <div
                        className={`text-2xl sm:text-3xl md:text-3xl font-bold tracking-tight ${heading}`}
                      >
                        {item.value}
                      </div>
                      <p
                        className={`mt-1 sm:mt-1.5 text-xs sm:text-sm font-medium ${body}`}
                      >
                        {item.label}
                      </p>
                      <p
                        className={`mt-0.5 sm:mt-1 text-[10px] sm:text-xs ${muted}`}
                      >
                        {item.hint}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </section>

      {/* ── ACTIVITY + QUICK ACTIONS ─────────────────────── */}
      <section className="w-full px-4 pb-8 sm:px-6 lg:px-10 2xl:px-20 animate-slide-up animate-delay-200">
        <div className="grid gap-5 xl:grid-cols-3">
          {/* Activity feed */}
          <Card className={`xl:col-span-1 rounded-2xl border ${card}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-base font-semibold ${heading}`}>
                  Recent activity
                </CardTitle>
                <Lightning size={16} className="text-amber-500" weight="fill" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  action: "New employee added",
                  time: "2m ago",
                  color: "bg-blue-500",
                },
                {
                  action: "Department updated",
                  time: "18m ago",
                  color: "bg-violet-500",
                },
                {
                  action: "Salary record changed",
                  time: "1h ago",
                  color: "bg-emerald-500",
                },
                {
                  action: "New department created",
                  time: "3h ago",
                  color: "bg-amber-500",
                },
                {
                  action: "Employee record edited",
                  time: "5h ago",
                  color: "bg-rose-500",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${item.color} shrink-0`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${body}`}>{item.action}</p>
                  </div>
                  <span className={`text-xs shrink-0 ${muted}`}>
                    {item.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payroll breakdown */}
          <Card className={`xl:col-span-2 rounded-2xl border ${card}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-base font-semibold ${heading}`}>
                  Payroll breakdown
                </CardTitle>
                <Link
                  to="/employees"
                  className={`text-xs flex items-center gap-1 ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                >
                  View all <ArrowUpRight size={12} />
                </Link>
              </div>
              <CardDescription className={muted}>
                Salary distribution across the workforce
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentPayroll.length > 0 ? (
                  departmentPayroll.slice(0, 5).map((row) => (
                    <div key={row.departmentId} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className={body}>{row.departmentName}</span>
                        <span className={`font-semibold ${heading}`}>
                          {row.percentage}%
                        </span>
                      </div>
                      <div
                        className={`h-2 w-full rounded-full ${isDark ? "bg-white/8" : "bg-slate-100"}`}
                      >
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${row.color} transition-all duration-700`}
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <div className={`text-xs ${muted}`}>
                        {currency(row.totalPayroll)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-8 ${muted}`}>
                    <p>No payroll data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── QUICK ACTION CARDS ────────────────────────────── */}
      <section className="w-full px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20 2xl:px-20 animate-slide-up animate-delay-300">
        <div className="mb-8 text-center">
          <Badge
            className={`mb-4 inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold ${
              isDark
                ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                : "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            <Sparkle size={13} weight="fill" className="mr-1.5" />
            Quick actions
          </Badge>
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight mt-4 ${heading}`}
          >
            Jump into your workspace
          </h2>
          <p className={`mt-3 text-base leading-7 max-w-2xl mx-auto ${body}`}>
            Your most-used sections, one click away.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2 max-w-6xl mx-auto">
          {overviewCards.map((card_) => {
            const Icon = card_.icon;
            return (
              <Card
                key={card_.title}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isDark
                    ? "border-white/10 bg-slate-900/50 hover:border-white/20 hover:shadow-black/40"
                    : "border-slate-200 bg-white/80 shadow-sm hover:border-slate-300 hover:shadow-slate-300/50"
                }`}
              >
                {/* Animated background glow */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDark ? "" : ""
                  }`}
                  style={{
                    background: `radial-gradient(ellipse at center, var(--gradient-color) 0%, transparent 70%)`,
                  }}
                />

                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className={`text-xl font-bold ${heading}`}>
                        {card_.title}
                      </CardTitle>
                      <CardDescription
                        className={`mt-2 text-sm leading-7 ${body}`}
                      >
                        {card_.description}
                      </CardDescription>
                    </div>
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card_.gradient} text-white shadow-lg shadow-blue-500/20 group-hover:shadow-xl transition-all duration-300`}
                    >
                      <Icon size={24} weight="fill" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="mb-6 space-y-3">
                    {card_.points.map((point) => (
                      <div key={point} className="flex items-center gap-3">
                        <CheckCircle
                          size={16}
                          weight="fill"
                          className="text-emerald-500 shrink-0"
                        />
                        <span className={`text-sm font-medium ${body}`}>
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    className={`rounded-full px-6 h-11 gap-2 bg-gradient-to-r ${card_.gradient} border-0 text-white shadow-lg font-semibold text-sm group-hover:shadow-xl transition-all duration-300 hover:scale-105`}
                  >
                    <Link to={card_.href}>
                      {card_.buttonLabel}
                      <ArrowRight size={16} weight="bold" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function QuickInsight({
  isDark,
  label,
  value,
  icon,
}: {
  isDark: boolean;
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        isDark ? "border-white/8 bg-white/4" : "border-slate-100 bg-slate-50"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 text-xs mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}
      >
        {icon}
        {label}
      </div>
      <p
        className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
      >
        {value}
      </p>
    </div>
  );
}
