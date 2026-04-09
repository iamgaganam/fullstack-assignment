import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { employeeAPI, departmentAPI } from "@/api";
import type {
  Employee,
  Department,
  EmployeeFormData,
  PageProps,
} from "@/types";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Briefcase,
  CurrencyDollar,
  EnvelopeSimple,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Trash,
  Users,
  X,
  CheckCircle,
  SquaresFour,
} from "@phosphor-icons/react";
import { Toaster, toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type EmployeePageProps = PageProps;

function currency(value: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

const AVATAR_GRADIENTS = [
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-fuchsia-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-blue-500",
];

function getGradient(id: number) {
  return AVATAR_GRADIENTS[id % AVATAR_GRADIENTS.length];
}

export function EmployeePage({ isDark }: EmployeePageProps) {
  const location = useLocation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    emailAddress: "",
    dateOfBirth: "",
    salary: 0,
    departmentId: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const state = location.state as { scrollToEmployeeId?: number } | null;
    if (state?.scrollToEmployeeId && employees.length > 0) {
      const element = document.getElementById(
        `employee-row-${state.scrollToEmployeeId}`,
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("highlight-row");
      }
    }
  }, [employees, location.state]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [empData, deptData] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
      ]);
      setEmployees(empData);
      setDepartments(deptData);
    } catch (error) {
      toast.error("Failed to load employee data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else if (calculateAge(formData.dateOfBirth) < 18) {
      newErrors.dateOfBirth = "Employee must be at least 18 years old";
    }
    if (formData.salary <= 0)
      newErrors.salary = "Salary must be greater than 0";
    if (formData.departmentId === 0)
      newErrors.departmentId = "Department is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      const submitData = {
        ...formData,
        salary: parseFloat(formData.salary.toString()),
      };
      if (editingId) {
        await employeeAPI.update(editingId, {
          employeeId: editingId,
          ...submitData,
          age: calculateAge(formData.dateOfBirth),
        });
        toast.success("Employee updated successfully");
      } else {
        await employeeAPI.create(submitData);
        toast.success("Employee created successfully");
      }
      handleCloseModal();
      await loadData();
    } catch (error) {
      toast.error(
        editingId ? "Failed to update employee" : "Failed to create employee",
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (emp: Employee) => {
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      emailAddress: emp.emailAddress,
      dateOfBirth: emp.dateOfBirth.split("T")[0],
      salary: emp.salary,
      departmentId: emp.departmentId,
    });
    setEditingId(emp.employeeId);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await employeeAPI.delete(deleteTarget.employeeId);
      setEmployees((prev) =>
        prev.filter((e) => e.employeeId !== deleteTarget.employeeId),
      );
      toast.success("Employee deleted successfully");
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setErrors({});
    setFormData({
      firstName: "",
      lastName: "",
      emailAddress: "",
      dateOfBirth: "",
      salary: 0,
      departmentId: 0,
    });
  };

  const getDepartmentName = (departmentId: number) =>
    departments.find((d) => d.departmentId === departmentId)?.departmentName ||
    "—";

  const getDepartmentCode = (departmentId: number) =>
    departments.find((d) => d.departmentId === departmentId)?.departmentCode ||
    "";

  const selectedDepartmentName = formData.departmentId
    ? departments.find((d) => d.departmentId === formData.departmentId)
        ?.departmentName || ""
    : "";

  const filteredEmployees = useMemo(
    () =>
      employees.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [employees, searchTerm],
  );

  const totalPayroll = filteredEmployees.reduce(
    (sum, emp) => sum + (emp.salary || 0),
    0,
  );
  const averageAge =
    filteredEmployees.length > 0
      ? Math.round(
          filteredEmployees.reduce(
            (sum, emp) => sum + calculateAge(emp.dateOfBirth),
            0,
          ) / filteredEmployees.length,
        )
      : 0;
  const departmentCoverage = new Set(
    filteredEmployees.map((emp) => emp.departmentId),
  ).size;

  const heading = isDark ? "text-white" : "text-slate-900";
  const body = isDark ? "text-slate-400" : "text-slate-600";
  const muted = isDark ? "text-slate-500" : "text-slate-400";
  const card = isDark
    ? "border-white/8 bg-white/3"
    : "border-slate-200 bg-white shadow-sm";
  const inputCls = isDark
    ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-violet-500/50"
    : "border-slate-200 bg-slate-50";

  return (
    <main
      className={`min-h-screen w-full ${
        isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"
      }`}
    >
      {/* ── HEADER ───────────────────────────────────────────── */}
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
                <Users size={14} weight="fill" />
                <span className="font-medium">Employee Workspace</span>
              </div>

              <h1
                className={`text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] ${heading}`}
              >
                Manage your workforce
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  in one place.
                </span>
              </h1>

              <p className={`mt-4 max-w-xl text-base leading-8 ${body}`}>
                Add, edit, and track employee records, salaries, and department
                assignments — all from a premium, focused interface.
              </p>
            </div>

            <Button
              onClick={() => {
                setEditingId(null);
                setErrors({});
                setFormData({
                  firstName: "",
                  lastName: "",
                  emailAddress: "",
                  dateOfBirth: "",
                  salary: 0,
                  departmentId: 0,
                });
                setShowModal(true);
              }}
              className="rounded-full px-6 h-11 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-500/20 text-white font-medium"
            >
              <Plus size={17} weight="bold" />
              Add employee
            </Button>
          </div>
        </div>
      </section>

      {/* ── SEARCH + QUICK STATS ─────────────────────────────── */}
      <section className="w-full px-4 pb-6 sm:px-6 lg:px-10 2xl:px-20 animate-slide-up animate-delay-100">
        {/* Search bar */}
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 mb-4 mt-3 sm:mt-4 ${card}`}
        >
          <MagnifyingGlass size={17} className={muted} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email…"
            className={`flex-1 bg-transparent text-sm outline-none ${
              isDark
                ? "text-white placeholder:text-slate-600"
                : "text-slate-900 placeholder:text-slate-400"
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className={`rounded-full p-0.5 ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid gap-3 sm:gap-4 md:gap-5 xs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total employees",
              value: filteredEmployees.length.toLocaleString(),
              icon: Users,
              color: "blue",
              gradient: "from-blue-500 to-cyan-500",
              bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
              hint: "Employees in the current view",
            },
            {
              label: "Avg age",
              value: averageAge.toString(),
              icon: Briefcase,
              color: "violet",
              gradient: "from-violet-500 to-purple-500",
              bg: isDark ? "bg-violet-500/10" : "bg-violet-50",
              hint: "Calculated from birth dates",
              suffix: " yrs",
            },
            {
              label: "Departments",
              value: departmentCoverage.toLocaleString(),
              icon: SquaresFour,
              color: "emerald",
              gradient: "from-emerald-500 to-teal-500",
              bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
              hint: "Unique teams across results",
            },
            {
              label: "Total payroll",
              value: currency(totalPayroll),
              icon: CurrencyDollar,
              color: "amber",
              gradient: "from-amber-500 to-orange-500",
              bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
              hint: "Combined salary amount",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.label}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${card} ${
                  isDark ? "hover:shadow-black/30" : "hover:shadow-slate-200"
                }`}
              >
                <CardContent className="py-3 sm:py-4 px-3 sm:px-4 flex flex-col items-center justify-center text-center">
                  <div
                    className={`flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} text-white shadow-md mb-2 sm:mb-3`}
                  >
                    <Icon size={16} weight="fill" />
                  </div>
                  <div
                    className={`text-xl sm:text-2xl font-bold tracking-tight ${heading}`}
                  >
                    {item.value}
                    {item.suffix && (
                      <span className="text-sm">{item.suffix}</span>
                    )}
                  </div>
                  <p className={`mt-1 text-xs font-medium ${body}`}>
                    {item.label}
                  </p>
                  <p className={`mt-0.5 text-[9px] sm:text-[10px] ${muted}`}>
                    {item.hint}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── TABLE ─────────────────────────────────────────────── */}
      <section className="w-full px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20 2xl:px-20 animate-slide-up animate-delay-200">
        <Card
          className={`overflow-hidden rounded-2xl border ${
            isDark
              ? "border-white/8 bg-white/3"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <CardHeader
            className={`pb-4 border-b ${isDark ? "border-white/8" : "border-slate-100"}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className={`text-xl font-bold ${heading}`}>
                  Employee directory
                </CardTitle>
                <CardDescription className={`mt-1 text-sm ${muted}`}>
                  Browse, edit, and manage your full workforce.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {filteredEmployees.length > 0 && (
                  <Badge
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      isDark
                        ? "border-white/8 bg-white/5 text-slate-400"
                        : "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-200"
                    }`}
                  >
                    {filteredEmployees.length} employee
                    {filteredEmployees.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={`h-16 w-full rounded-xl ${isDark ? "bg-white/5" : ""}`}
                  />
                ))}
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-100"}`}
                >
                  <Users size={28} className={muted} weight="fill" />
                </div>
                <h3 className={`text-lg font-semibold ${heading}`}>
                  No employees found
                </h3>
                <p className={`mt-2 max-w-sm text-sm leading-7 ${body}`}>
                  {searchTerm
                    ? `No results for "${searchTerm}". Try a different search.`
                    : "Add your first employee to start building your directory."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowModal(true)}
                    className="mt-6 rounded-full px-6 gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 border-0 text-white"
                  >
                    <Plus size={17} weight="bold" />
                    Add employee
                  </Button>
                )}
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className={`mt-5 rounded-full px-5 gap-2 ${isDark ? "border-white/10 bg-white/5 text-white" : ""}`}
                  >
                    <X size={14} />
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      className={isDark ? "border-white/8" : "border-slate-100"}
                    >
                      {[
                        "Employee",
                        "Email",
                        "Department",
                        "Age",
                        "Salary",
                        "",
                      ].map((h, i) => (
                        <TableHead
                          key={i}
                          className={`text-xs font-semibold uppercase tracking-wider ${muted} ${i === 5 ? "text-right" : ""}`}
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((emp) => (
                      <TableRow
                        key={emp.employeeId}
                        id={`employee-row-${emp.employeeId}`}
                        className={`transition-colors highlight-row ${
                          isDark
                            ? "border-white/8 hover:bg-white/3"
                            : "border-slate-100 hover:bg-slate-50/80"
                        }`}
                      >
                        {/* Name + avatar */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getGradient(emp.employeeId)} text-white text-xs font-bold shadow-sm`}
                            >
                              {emp.firstName.charAt(0)}
                              {emp.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className={`font-semibold text-sm ${heading}`}>
                                {emp.firstName} {emp.lastName}
                              </p>
                              <p className={`text-xs ${muted}`}>
                                #{emp.employeeId}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell>
                          <div
                            className={`flex items-center gap-2 text-sm ${body}`}
                          >
                            <EnvelopeSimple size={13} className={muted} />
                            <span className="truncate max-w-[200px]">
                              {emp.emailAddress}
                            </span>
                          </div>
                        </TableCell>

                        {/* Department */}
                        <TableCell>
                          <Badge
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              isDark
                                ? "border-blue-500/20 bg-blue-500/8 text-blue-300"
                                : "border-blue-200 bg-blue-50 text-blue-700"
                            }`}
                          >
                            {getDepartmentCode(emp.departmentId) ||
                              getDepartmentName(emp.departmentId)}
                          </Badge>
                        </TableCell>

                        {/* Age */}
                        <TableCell>
                          <span className={`text-sm ${body}`}>
                            {calculateAge(emp.dateOfBirth)}
                            <span className={`ml-1 text-xs ${muted}`}>yrs</span>
                          </span>
                        </TableCell>

                        {/* Salary */}
                        <TableCell>
                          <span className={`text-sm font-semibold ${heading}`}>
                            {currency(emp.salary)}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(emp)}
                              className={`flex h-8 w-8 items-center justify-center rounded-full p-0 ${
                                isDark
                                  ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                              title="Edit"
                            >
                              <PencilSimple size={12} weight="fill" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteTarget(emp)}
                              className={`flex h-8 w-8 items-center justify-center rounded-full p-0 ${
                                isDark
                                  ? "border-red-500/20 bg-red-500/8 text-red-400 hover:bg-red-500/15"
                                  : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                              title="Delete"
                            >
                              <Trash size={12} weight="fill" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ── CREATE / EDIT MODAL ──────────────────────────────── */}
      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
          else setShowModal(true);
        }}
      >
        <DialogContent
          className={`max-h-[90vh] overflow-y-auto rounded-[32px] p-0 shadow-2xl sm:max-w-[56rem] ${
            isDark
              ? "border-white/10 bg-slate-950 text-white"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent rounded-t-[32px]" />

          <DialogHeader
            className={
              isDark
                ? "border-white/10 px-6 py-5 sm:px-8"
                : "border-slate-100 px-6 py-5 sm:px-8"
            }
          >
            <div className="mb-1 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-md">
                <Users size={18} weight="fill" />
              </div>
              <div>
                <DialogTitle
                  className={`text-xl font-bold tracking-tight ${heading}`}
                >
                  {editingId ? "Edit employee" : "Create employee"}
                </DialogTitle>
                <DialogDescription className={`text-sm ${muted}`}>
                  Fill in the details below to{" "}
                  {editingId ? "update the" : "add a new"} employee record.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-5 px-6 py-5 sm:px-8 sm:py-6">
            {/* Name row */}
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <FormField label="First name" error={errors.firstName}>
                <Input
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, firstName: e.target.value }))
                  }
                  className={`h-11 rounded-xl ${errors.firstName ? "border-red-500" : ""} ${inputCls}`}
                />
              </FormField>
              <FormField label="Last name" error={errors.lastName}>
                <Input
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, lastName: e.target.value }))
                  }
                  className={`h-11 rounded-xl ${errors.lastName ? "border-red-500" : ""} ${inputCls}`}
                />
              </FormField>
            </div>

            {/* Email */}
            <FormField label="Email address" error={errors.emailAddress}>
              <div className="relative">
                <EnvelopeSimple
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${muted}`}
                />
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.emailAddress}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, emailAddress: e.target.value }))
                  }
                  className={`h-11 rounded-xl pl-10 ${errors.emailAddress ? "border-red-500" : ""} ${inputCls}`}
                />
              </div>
            </FormField>

            {/* DOB + Age */}
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <FormField label="Date of birth" error={errors.dateOfBirth}>
                <DatePickerField
                  isDark={isDark}
                  value={formData.dateOfBirth}
                  onChange={(value) =>
                    setFormData((p) => ({ ...p, dateOfBirth: value }))
                  }
                />
              </FormField>
              <FormField label="Age (calculated)">
                <Input
                  value={
                    formData.dateOfBirth
                      ? `${calculateAge(formData.dateOfBirth)} years old`
                      : ""
                  }
                  disabled
                  className={`h-11 rounded-xl ${isDark ? "border-white/10 bg-white/3 text-slate-500" : "bg-slate-50 text-slate-400"}`}
                />
              </FormField>
            </div>

            {/* Salary + Department */}
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <FormField label="Salary (USD)" error={errors.salary}>
                <div className="relative">
                  <CurrencyDollar
                    size={15}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${muted}`}
                  />
                  <Input
                    type="number"
                    step="100"
                    placeholder="50000"
                    value={formData.salary || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        salary: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className={`h-11 rounded-xl pl-10 ${errors.salary ? "border-red-500" : ""} ${inputCls}`}
                  />
                </div>
              </FormField>
              <FormField label="Department" error={errors.departmentId}>
                <Select
                  value={
                    formData.departmentId
                      ? String(formData.departmentId)
                      : undefined
                  }
                  onValueChange={(val) =>
                    setFormData((p) => ({
                      ...p,
                      departmentId: parseInt(val, 10),
                    }))
                  }
                >
                  <SelectTrigger
                    className={`h-11 rounded-xl ${errors.departmentId ? "border-red-500" : ""} ${inputCls}`}
                  >
                    <SelectValue placeholder="Select department">
                      {selectedDepartmentName}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    className={
                      isDark ? "border-white/10 bg-slate-950 text-white" : ""
                    }
                  >
                    {departments.map((dept) => (
                      <SelectItem
                        key={dept.departmentId}
                        value={String(dept.departmentId)}
                      >
                        {dept.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>

          <DialogFooter
            className={`gap-3 p-5 sm:gap-3 sm:px-8 ${isDark ? "border-white/10" : "border-slate-100"}`}
          >
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className={`h-11 flex-1 rounded-full ${
                isDark
                  ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-full gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0 text-white shadow-md shadow-violet-500/20"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {editingId ? "Updating…" : "Creating…"}
                </span>
              ) : (
                <>
                  <CheckCircle size={15} weight="fill" />
                  {editingId ? "Update employee" : "Create employee"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DELETE DIALOG ────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent
          className={`overflow-hidden rounded-[28px] p-0 shadow-2xl sm:max-w-[28rem] ${
            isDark
              ? "border-white/10 bg-slate-950 text-white"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          <AlertDialogHeader
            className={`px-6 py-6 text-center ${
              isDark ? "border-white/10" : "border-slate-100"
            }`}
          >
            <div
              className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${
                isDark
                  ? "bg-red-500/10 ring-1 ring-red-500/15"
                  : "bg-red-50 ring-1 ring-red-100"
              }`}
            >
              <Trash size={20} className="text-red-500" weight="fill" />
            </div>
            <AlertDialogTitle
              className={`text-center text-xl font-bold tracking-tight ${heading}`}
            >
              Delete employee?
            </AlertDialogTitle>
            <AlertDialogDescription
              className={`mx-auto max-w-sm text-center text-sm leading-7 ${body}`}
            >
              This will permanently remove{" "}
              <span className={`font-semibold ${heading}`}>
                {deleteTarget?.firstName} {deleteTarget?.lastName}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter
            className={`gap-2.5 p-5 ${
              isDark ? "border-white/10" : "border-slate-100"
            }`}
          >
            <AlertDialogCancel
              className={`h-10 flex-1 rounded-full px-5 text-sm font-medium ${
                isDark
                  ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-10 flex-1 rounded-full border-0 bg-red-600 px-5 text-sm font-medium text-white shadow-md shadow-red-500/20 hover:bg-red-700"
            >
              Delete employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster position="top-right" theme={isDark ? "dark" : "light"} />
    </main>
  );
}

/* ── Shared form field wrapper ───────────────────────────── */
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseIsoDate(value: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(value: string) {
  const date = parseIsoDate(value);
  if (!date) return "mm/dd/yyyy";

  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatDateSummary(value: string) {
  const date = parseIsoDate(value);
  if (!date) return "No date selected";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarDays(viewDate: Date) {
  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  const calendarStart = new Date(monthStart);
  calendarStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    date.setHours(0, 0, 0, 0);

    return {
      date,
      inCurrentMonth: date.getMonth() === viewDate.getMonth(),
    };
  });
}

function DatePickerField({
  value,
  onChange,
  isDark,
}: {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = parseIsoDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [viewDate, setViewDate] = useState(selectedDate ?? new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    // Sync viewDate with selectedDate when isOpen changes is correct; these are proper dependencies
    if (!isOpen) return;
    setViewDate(selectedDate ?? new Date());
  }, [isOpen, selectedDate]);

  useLayoutEffect(() => {
    // Using useLayoutEffect for DOM positioning measurements is the correct React pattern
    if (!isOpen || !triggerRef.current) {
      setPanelPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, 320);
      const left = Math.min(
        Math.max(16, rect.left),
        window.innerWidth - width - 16,
      );

      setPanelPosition({
        top: rect.bottom + 8,
        left,
        width,
      });
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const years = Array.from(
    { length: 81 },
    (_, index) => today.getFullYear() - index,
  );
  const days = getCalendarDays(viewDate);

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-4 text-left transition-colors ${
          isDark
            ? `border-white/10 bg-white/5 text-white ${
                isOpen
                  ? "border-violet-500/40 ring-1 ring-violet-500/40"
                  : "hover:bg-white/[0.07]"
              }`
            : `border-slate-200 bg-slate-50 text-slate-900 ${
                isOpen
                  ? "border-violet-400 ring-1 ring-violet-200"
                  : "hover:bg-white"
              }`
        }`}
      >
        <span
          className={`truncate ${
            value
              ? isDark
                ? "text-white"
                : "text-slate-900"
              : isDark
                ? "text-slate-500"
                : "text-slate-400"
          }`}
        >
          {formatDateDisplay(value)}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isDark ? "bg-white/5 text-slate-400" : "bg-white text-slate-500"
          }`}
        >
          <CalendarBlank size={16} />
        </span>
      </button>

      {isOpen &&
        panelPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: panelPosition.top,
              left: panelPosition.left,
              width: panelPosition.width,
            }}
            className={`z-[80] overflow-hidden rounded-2xl border shadow-2xl ${
              isDark
                ? "border-white/10 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div
              className={`flex items-center justify-between gap-3 border-b px-3 py-3 ${
                isDark ? "border-white/10" : "border-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setViewDate(
                      new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isDark
                      ? "bg-white/5 text-slate-300 hover:bg-white/10"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <CaretLeft size={14} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setViewDate(
                      new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isDark
                      ? "bg-white/5 text-slate-300 hover:bg-white/10"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <CaretRight size={14} weight="bold" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={viewDate.getMonth()}
                  onChange={(event) =>
                    setViewDate(
                      new Date(
                        viewDate.getFullYear(),
                        parseInt(event.target.value, 10),
                        1,
                      ),
                    )
                  }
                  className={`h-9 rounded-xl border px-3 text-sm outline-none ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                >
                  {MONTH_LABELS.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={viewDate.getFullYear()}
                  onChange={(event) =>
                    setViewDate(
                      new Date(
                        parseInt(event.target.value, 10),
                        viewDate.getMonth(),
                        1,
                      ),
                    )
                  }
                  className={`h-9 rounded-xl border px-3 text-sm outline-none ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-3 py-3">
              <div
                className={`mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {WEEKDAY_LABELS.map((label) => (
                  <span key={label} className="py-1">
                    {label}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map(({ date, inCurrentMonth }) => {
                  const isSelected = selectedDate
                    ? isSameDay(date, selectedDate)
                    : false;
                  const isToday = isSameDay(date, today);
                  const isFuture = date > today;

                  return (
                    <button
                      key={toIsoDate(date)}
                      type="button"
                      disabled={isFuture}
                      onClick={() => {
                        onChange(toIsoDate(date));
                        setIsOpen(false);
                      }}
                      className={`flex h-10 items-center justify-center rounded-xl text-sm transition-colors ${
                        isSelected
                          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20"
                          : isDark
                            ? "text-slate-200 hover:bg-white/6"
                            : "text-slate-700 hover:bg-slate-100"
                      } ${
                        !inCurrentMonth && !isSelected
                          ? isDark
                            ? "text-slate-600"
                            : "text-slate-400"
                          : ""
                      } ${
                        isToday && !isSelected
                          ? isDark
                            ? "ring-1 ring-violet-500/40"
                            : "ring-1 ring-violet-300"
                          : ""
                      } ${isFuture ? "cursor-not-allowed opacity-35 hover:bg-transparent" : ""}`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={`flex items-center justify-between gap-3 border-t px-3 py-3 ${
                isDark ? "border-white/10" : "border-slate-100"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-white/5 text-slate-300 hover:bg-white/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Clear
              </button>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {formatDateSummary(value)}
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X size={11} /> {error}
        </p>
      )}
    </div>
  );
}
