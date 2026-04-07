import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { departmentAPI, employeeAPI } from "@/api";
import {
  Users,
  SquaresFour,
  ArrowRight,
  ChartLine,
  CurrencyDollar,
} from "@phosphor-icons/react";

interface DashboardProps {
  isDark: boolean;
}

interface Stats {
  totalEmployees: number;
  totalDepartments: number;
  averageSalary: number;
  totalSalary: number;
}

interface Employee {
  salary?: number;
}

export function Dashboard({ isDark }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    totalDepartments: 0,
    averageSalary: 0,
    totalSalary: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const [employees, departments] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
      ]);

      const totalSalary = employees.reduce(
        (sum: number, emp: Employee) => sum + (emp.salary || 0),
        0,
      );
      const averageSalary =
        employees.length > 0 ? totalSalary / employees.length : 0;

      setStats({
        totalEmployees: employees.length,
        totalDepartments: departments.length,
        averageSalary: Math.round(averageSalary),
        totalSalary: Math.round(totalSalary),
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Dashboard
          </h1>
          <p
            className={`text-lg ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            Welcome to your management system. Here's an overview of your data.
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`rounded-lg p-6 ${
                  isDark ? "bg-slate-900" : "bg-white"
                } animate-pulse`}
              >
                <div
                  className={`h-12 w-12 rounded-lg mb-3 ${
                    isDark ? "bg-slate-800" : "bg-slate-200"
                  }`}
                ></div>
                <div
                  className={`h-8 w-24 rounded ${
                    isDark ? "bg-slate-800" : "bg-slate-200"
                  } mb-2`}
                ></div>
                <div
                  className={`h-4 w-32 rounded ${
                    isDark ? "bg-slate-800" : "bg-slate-200"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Employees */}
            <div
              className={`rounded-lg p-6 border transition-all hover:shadow-lg ${
                isDark
                  ? "bg-slate-900 border-slate-700 hover:border-blue-500"
                  : "bg-white border-slate-200 hover:border-blue-500"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    isDark
                      ? "bg-blue-900/50 text-blue-400"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <Users size={24} weight="bold" />
                </div>
              </div>
              <h3
                className={`text-3xl font-bold mb-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {stats.totalEmployees}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Total Employees
              </p>
            </div>

            {/* Total Departments */}
            <div
              className={`rounded-lg p-6 border transition-all hover:shadow-lg ${
                isDark
                  ? "bg-slate-900 border-slate-700 hover:border-purple-500"
                  : "bg-white border-slate-200 hover:border-purple-500"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    isDark
                      ? "bg-purple-900/50 text-purple-400"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <SquaresFour size={24} weight="bold" />
                </div>
              </div>
              <h3
                className={`text-3xl font-bold mb-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {stats.totalDepartments}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Total Departments
              </p>
            </div>

            {/* Average Salary */}
            <div
              className={`rounded-lg p-6 border transition-all hover:shadow-lg ${
                isDark
                  ? "bg-slate-900 border-slate-700 hover:border-green-500"
                  : "bg-white border-slate-200 hover:border-green-500"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    isDark
                      ? "bg-green-900/50 text-green-400"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  <ChartLine size={24} weight="bold" />
                </div>
              </div>
              <h3
                className={`text-3xl font-bold mb-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                ${stats.averageSalary.toLocaleString()}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Average Salary
              </p>
            </div>

            {/* Total Salary */}
            <div
              className={`rounded-lg p-6 border transition-all hover:shadow-lg ${
                isDark
                  ? "bg-slate-900 border-slate-700 hover:border-orange-500"
                  : "bg-white border-slate-200 hover:border-orange-500"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    isDark
                      ? "bg-orange-900/50 text-orange-400"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  <CurrencyDollar size={24} weight="bold" />
                </div>
              </div>
              <h3
                className={`text-3xl font-bold mb-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                ${stats.totalSalary.toLocaleString()}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Total Payroll
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Departments Card */}
          <div
            className={`rounded-lg p-8 border transition-all hover:shadow-lg ${
              isDark
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Department Management
                </h2>
                <p
                  className={`${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  Manage your organization's departments efficiently.
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDark
                    ? "bg-blue-900/50 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <SquaresFour size={28} weight="bold" />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <p
                className={`flex items-center space-x-2 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>Create new departments</span>
              </p>
              <p
                className={`flex items-center space-x-2 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>Edit department information</span>
              </p>
              <p
                className={`flex items-center space-x-2 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>Remove departments</span>
              </p>
            </div>

            <Link
              to="/departments"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors group"
            >
              <span>Go to Departments</span>
              <ArrowRight
                size={18}
                weight="bold"
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Employees Card */}
          <div
            className={`rounded-lg p-8 border transition-all hover:shadow-lg ${
              isDark
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Employee Management
                </h2>
                <p
                  className={`${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  Handle all employee information and assignments.
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDark
                    ? "bg-purple-900/50 text-purple-400"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                <Users size={28} weight="bold" />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <p
                className={`flex items-center space-x-2 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                <span>Add new employees</span>
              </p>
              <p
                className={`flex items-center space-x-2 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                <span>Update employee details</span>
              </p>
              <p
                className={`flex items-center space-x-2 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                <span>Manage salaries and departments</span>
              </p>
            </div>

            <Link
              to="/employees"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors group"
            >
              <span>Go to Employees</span>
              <ArrowRight
                size={18}
                weight="bold"
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
