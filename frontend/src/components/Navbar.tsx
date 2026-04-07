import { Link } from "react-router-dom";
import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

interface NavbarProps {
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export function Navbar({ isDark, onToggleDarkMode }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-slate-950/95 border-b border-slate-800"
            : "bg-white/95 border-b border-slate-200"
          : isDark
            ? "bg-slate-950"
            : "bg-white"
      } backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 font-bold text-2xl hover:opacity-80 transition-opacity"
          >
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center`}
            >
              <span className="text-white font-bold">M</span>
            </div>
            <span
              className={`${
                isDark ? "text-white" : "text-slate-900"
              } hidden sm:inline`}
            >
              Management
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors hover:text-blue-500 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/departments"
              className={`transition-colors hover:text-blue-500 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Departments
            </Link>
            <Link
              to="/employees"
              className={`transition-colors hover:text-blue-500 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Employees
            </Link>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-yellow-400"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={20} weight="fill" />
            ) : (
              <Moon size={20} weight="fill" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
