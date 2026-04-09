import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  List,
  ArrowRight,
  ArrowUpRight,
  MagnifyingGlass,
  X,
  Briefcase,
  Buildings,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { employeeAPI, departmentAPI } from "@/api";
import type { Employee, Department } from "@/types";
import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  isDark: boolean;
  onToggleDarkMode: () => void;
}

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Departments", to: "/departments" },
  { label: "Employees", to: "/employees" },
];

export function Navbar({ isDark, onToggleDarkMode }: NavbarProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState<{
    employees: Employee[];
    departments: Department[];
  }>({ employees: [], departments: [] });
  const [isSearching, setIsSearching] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handle search
  useEffect(() => {
    const searchData = async () => {
      if (!searchVal.trim()) {
        setSearchResults({ employees: [], departments: [] });
        return;
      }

      setIsSearching(true);
      try {
        const query = searchVal.toLowerCase();
        const [employees, departments] = await Promise.all([
          employeeAPI.getAll(),
          departmentAPI.getAll(),
        ]);

        const filteredEmployees = employees.filter(
          (emp: Employee) =>
            emp.firstName.toLowerCase().includes(query) ||
            emp.lastName.toLowerCase().includes(query) ||
            emp.emailAddress.toLowerCase().includes(query),
        );

        const filteredDepartments = departments.filter(
          (dept: Department) =>
            dept.departmentName.toLowerCase().includes(query) ||
            dept.departmentCode.toLowerCase().includes(query),
        );

        setSearchResults({
          employees: filteredEmployees.slice(0, 5),
          departments: filteredDepartments.slice(0, 5),
        });
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults({ employees: [], departments: [] });
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchData, 300);
    return () => clearTimeout(timer);
  }, [searchVal]);

  const pill =
    "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200";
  const inactive = isDark
    ? "text-slate-400 hover:text-white hover:bg-white/8"
    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80";
  const active = isDark
    ? "text-white bg-gradient-to-b from-white/15 to-white/8 shadow-inner shadow-white/5 ring-1 ring-white/10"
    : "text-slate-900 bg-white shadow-sm ring-1 ring-slate-200/80";

  return (
    <>
      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className={`absolute inset-0 ${
              isDark ? "bg-slate-950/80" : "bg-slate-900/40"
            } backdrop-blur-sm`}
          />
          <div
            className={`relative w-full max-w-2xl mx-4 rounded-2xl border shadow-2xl max-h-[70vh] overflow-y-auto flex flex-col ${
              isDark
                ? "bg-slate-900 border-white/10 shadow-black/60"
                : "bg-white border-slate-200 shadow-slate-300/60"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-inherit sticky top-0 bg-inherit">
              <MagnifyingGlass
                size={18}
                className={isDark ? "text-slate-400" : "text-slate-400"}
              />
              <input
                autoFocus
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search employees, departments…"
                className={`flex-1 bg-transparent text-sm outline-none ${
                  isDark
                    ? "text-white placeholder:text-slate-500"
                    : "text-slate-900 placeholder:text-slate-400"
                }`}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className={`rounded-lg p-1 ${
                  isDark
                    ? "text-slate-500 hover:text-slate-300"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1">
              {searchVal.trim() === "" && (
                <div className="px-5 py-8 text-center">
                  <p
                    className={`text-sm ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Start typing to search employees and departments…
                  </p>
                </div>
              )}

              {isSearching && searchVal.trim() !== "" && (
                <div className="px-5 py-8 text-center">
                  <p
                    className={`text-sm ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Searching…
                  </p>
                </div>
              )}

              {!isSearching &&
                searchVal.trim() !== "" &&
                searchResults.employees.length === 0 &&
                searchResults.departments.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p
                      className={`text-sm ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      No employees or departments found
                    </p>
                  </div>
                )}

              {/* Employees Results */}
              {searchResults.employees.length > 0 && (
                <div className="border-b border-inherit">
                  <div
                    className={`px-5 py-2 text-xs font-semibold uppercase tracking-wide ${
                      isDark ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    Employees
                  </div>
                  {searchResults.employees.map((emp) => (
                    <button
                      key={emp.employeeId}
                      onClick={() => {
                        navigate("/employees", {
                          state: { scrollToEmployeeId: emp.employeeId },
                        });
                        setSearchOpen(false);
                        setSearchVal("");
                      }}
                      className={`w-full text-left px-5 py-3 border-t border-inherit transition-colors ${
                        isDark
                          ? "hover:bg-white/5 text-white"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xs font-bold">
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              isDark ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {emp.emailAddress}
                          </p>
                        </div>
                        <Briefcase
                          size={14}
                          className={
                            isDark ? "text-slate-600" : "text-slate-300"
                          }
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Departments Results */}
              {searchResults.departments.length > 0 && (
                <div>
                  <div
                    className={`px-5 py-2 text-xs font-semibold uppercase tracking-wide ${
                      isDark ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    Departments
                  </div>
                  {searchResults.departments.map((dept) => (
                    <button
                      key={dept.departmentId}
                      onClick={() => {
                        navigate("/departments", {
                          state: { scrollToDepartmentId: dept.departmentId },
                        });
                        setSearchOpen(false);
                        setSearchVal("");
                      }}
                      className={`w-full text-left px-5 py-3 border-t border-inherit transition-colors ${
                        isDark
                          ? "hover:bg-white/5 text-white"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          <Buildings size={14} weight="bold" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {dept.departmentName}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              isDark ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {dept.departmentCode}
                          </p>
                        </div>
                        <Buildings
                          size={14}
                          className={
                            isDark ? "text-slate-600" : "text-slate-300"
                          }
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer hint */}
            {searchVal.trim() !== "" && (
              <div
                className={`px-5 py-3 border-t border-inherit text-xs ${
                  isDark ? "text-slate-600" : "text-slate-400"
                }`}
              >
                Press{" "}
                <kbd
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isDark
                      ? "bg-slate-800 text-slate-400"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  ESC
                </kbd>{" "}
                to close
              </div>
            )}
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 animate-fade-in ${
          scrolled
            ? isDark
              ? "border-b border-white/8 bg-slate-950/75 backdrop-blur-2xl backdrop-saturate-150"
              : "border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl backdrop-saturate-150"
            : isDark
              ? "border-b border-transparent bg-slate-950"
              : "border-b border-transparent bg-white"
        }`}
      >
        {/* Top accent line — gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />

        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-10 2xl:px-20">
          <div className="flex h-16 sm:h-[72px] items-center justify-between gap-2 sm:gap-4 relative">
            {/* Logo */}
            <Link
              to="/"
              className="group flex shrink-0 items-center gap-2 sm:gap-3 transition-all duration-300 z-10"
            >
              <img
                src={logo}
                alt="NexusHR Logo"
                className="h-10 w-10 sm:h-14 sm:w-14 object-contain drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
              />
              <div className="hidden xs:block sm:block leading-tight">
                <div
                  className={`text-sm sm:text-[15px] font-bold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  NexusHR
                </div>
                <div
                  className={`text-[10px] sm:text-[11px] font-medium ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  HR Management
                </div>
              </div>
            </Link>

            {/* Center Nav */}
            <nav
              className={`hidden absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-full border px-1 sm:px-1.5 py-1 sm:py-1.5 md:flex ${
                isDark
                  ? "border-white/8 bg-white/4"
                  : "border-slate-200 bg-slate-50/80"
              }`}
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={scrollToTop}
                  className={({ isActive }) =>
                    `${pill} ${isActive ? active : inactive}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto z-10">
              {/* Search - Mobile */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`md:hidden p-2 rounded-full border transition-all ${
                  isDark
                    ? "border-white/8 bg-white/4 text-slate-400 hover:text-slate-200 hover:bg-white/8"
                    : "border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                }`}
                aria-label="Search"
              >
                <MagnifyingGlass size={16} />
              </button>

              {/* Search - Desktop */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`hidden md:flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition-all ${
                  isDark
                    ? "border-white/8 bg-white/4 text-slate-400 hover:text-slate-200 hover:bg-white/8"
                    : "border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                }`}
              >
                <MagnifyingGlass size={14} />
                <span className="hidden lg:inline">Quick search</span>
                <kbd
                  className={`hidden lg:inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] ${
                    isDark
                      ? "bg-slate-800 text-slate-500"
                      : "bg-white border border-slate-200 text-slate-400"
                  }`}
                >
                  ⌘K
                </kbd>
              </button>

              {/* Dark mode */}
              <button
                onClick={onToggleDarkMode}
                className={`rounded-full border p-2 transition-all duration-300 ${
                  isDark
                    ? "border-white/8 bg-white/4 text-amber-300 hover:bg-white/10"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun size={17} weight="fill" />
                ) : (
                  <Moon size={17} weight="fill" />
                )}
              </button>

              {/* CTA */}
              <Button
                asChild
                className="hidden md:inline-flex rounded-full px-5 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-500/20 text-white font-medium"
              >
                <Link to="/employees">
                  Get started
                  <ArrowRight size={15} weight="bold" />
                </Link>
              </Button>

              {/* Mobile hamburger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full md:hidden ${
                      isDark
                        ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <List size={20} weight="bold" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className={`w-[85%] max-w-sm border-l ${
                    isDark
                      ? "border-white/10 bg-slate-950 text-white"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="mt-6 h-full flex flex-col px-1">
                    {/* Branding Section */}
                    <div
                      className={`pb-6 border-b px-3 ${
                        isDark ? "border-white/8" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <img
                          src={logo}
                          alt="NexusHR Logo"
                          className="h-12 w-12 object-contain drop-shadow-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-lg leading-tight">
                            NexusHR
                          </div>
                          <div
                            className={`text-xs font-medium ${
                              isDark ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            Workforce platform
                          </div>
                        </div>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Manage your workforce with intelligence and precision.
                      </p>
                    </div>

                    {/* Navigation Section */}
                    <div className="flex-1 overflow-y-auto py-6 px-1">
                      <div className="space-y-2 px-3">
                        <div
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-2 ${
                            isDark ? "text-slate-600" : "text-slate-400"
                          }`}
                        >
                          Navigation
                        </div>
                        {navItems.map((item) => (
                          <SheetClose asChild key={item.to}>
                            <NavLink
                              to={item.to}
                              end={item.to === "/"}
                              onClick={scrollToTop}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                                  isActive
                                    ? isDark
                                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/10"
                                      : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 ring-1 ring-blue-200 shadow-sm shadow-blue-100"
                                    : isDark
                                      ? "text-slate-400 hover:bg-white/5 hover:text-white"
                                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`
                              }
                            >
                              <div
                                className={`h-2 w-2 rounded-full transition-all ${
                                  item.to === "/"
                                    ? "bg-blue-500"
                                    : "bg-slate-400"
                                }`}
                              />
                              {item.label}
                            </NavLink>
                          </SheetClose>
                        ))}
                      </div>

                      {/* Theme Toggle */}
                      <div className="mt-8 px-3">
                        <div
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-2 ${
                            isDark ? "text-slate-600" : "text-slate-400"
                          }`}
                        >
                          Preferences
                        </div>
                        <button
                          onClick={onToggleDarkMode}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                            isDark
                              ? "text-slate-400 hover:bg-white/5 hover:text-white"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <div className={`text-lg`}>
                            {isDark ? (
                              <Sun size={18} weight="fill" />
                            ) : (
                              <Moon size={18} weight="fill" />
                            )}
                          </div>
                          <span>{isDark ? "Light mode" : "Dark mode"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Status & CTA Section */}
                    <div
                      className={`pt-6 border-t px-3 ${
                        isDark ? "border-white/8" : "border-slate-200"
                      }`}
                    >
                      {/* Status Indicator */}
                      <div
                        className={`rounded-xl border px-4 py-3.5 mb-4 ${
                          isDark
                            ? "border-emerald-500/20 bg-emerald-500/8"
                            : "border-emerald-200 bg-emerald-50"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="relative flex h-2.5 w-2.5 mt-0.5 flex-shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-semibold text-sm ${
                                isDark ? "text-emerald-300" : "text-emerald-800"
                              }`}
                            >
                              All systems operational
                            </p>
                            <p
                              className={`text-xs leading-relaxed mt-1 ${
                                isDark
                                  ? "text-emerald-200/60"
                                  : "text-emerald-700/70"
                              }`}
                            >
                              Your workspace is running at full capacity.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Get Started Button */}
                      <SheetClose asChild>
                        <Button
                          asChild
                          className="w-full rounded-xl h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 gap-2"
                        >
                          <Link to="/employees">
                            Get started
                            <ArrowRight size={16} weight="bold" />
                          </Link>
                        </Button>
                      </SheetClose>

                      {/* Quick Links */}
                      <div
                        className={`mt-4 pt-4 border-t px-3 ${
                          isDark ? "border-white/8" : "border-slate-200"
                        }`}
                      >
                        <div
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-2 ${
                            isDark ? "text-slate-600" : "text-slate-400"
                          }`}
                        >
                          Quick Links
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: "Documentation", href: "#" },
                            { label: "Support", href: "#" },
                          ].map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                                isDark
                                  ? "text-slate-400 hover:text-slate-300 hover:bg-white/4"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                              }`}
                            >
                              <ArrowUpRight size={12} weight="bold" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
