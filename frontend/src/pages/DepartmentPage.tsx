import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { departmentAPI } from "@/api";
import type { Department, DepartmentFormData, PageProps } from "@/types";
import {
  Buildings,
  CalendarBlank,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Trash,
  X,
  CheckCircle,
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

type DepartmentPageProps = PageProps;

export function DepartmentPage({ isDark }: DepartmentPageProps) {
  const location = useLocation();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

  const [formData, setFormData] = useState<DepartmentFormData>({
    departmentCode: "",
    departmentName: "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    const state = location.state as { scrollToDepartmentId?: number } | null;
    if (state?.scrollToDepartmentId && departments.length > 0) {
      const element = document.getElementById(
        `department-row-${state.scrollToDepartmentId}`,
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("highlight-row");
      }
    }
  }, [departments, location.state]);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      const data = await departmentAPI.getAll();
      setDepartments(data);
    } catch (error) {
      toast.error("Failed to load departments");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.departmentCode.trim())
      newErrors.departmentCode = "Department code is required";
    if (!formData.departmentName.trim())
      newErrors.departmentName = "Department name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      if (editingId) {
        await departmentAPI.update(editingId, {
          departmentId: editingId,
          ...formData,
        });
        toast.success("Department updated successfully");
      } else {
        await departmentAPI.create(formData);
        toast.success("Department created successfully");
      }
      handleCloseModal();
      await loadDepartments();
    } catch (error) {
      toast.error(
        editingId
          ? "Failed to update department"
          : "Failed to create department",
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (dept: Department) => {
    setFormData({
      departmentCode: dept.departmentCode,
      departmentName: dept.departmentName,
    });
    setEditingId(dept.departmentId);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await departmentAPI.delete(deleteTarget.departmentId);
      setDepartments((prev) =>
        prev.filter((d) => d.departmentId !== deleteTarget.departmentId),
      );
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error("Failed to delete department");
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setErrors({});
    setFormData({ departmentCode: "", departmentName: "" });
  };

  const filteredDepartments = useMemo(
    () =>
      departments.filter(
        (dept) =>
          dept.departmentCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [departments, searchTerm],
  );

  const heading = isDark ? "text-white" : "text-slate-900";
  const body = isDark ? "text-slate-400" : "text-slate-600";
  const muted = isDark ? "text-slate-500" : "text-slate-400";
  const card = isDark
    ? "border-white/8 bg-white/3"
    : "border-slate-200 bg-white shadow-sm";
  const inputCls = isDark
    ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500/50"
    : "border-slate-200 bg-slate-50 focus:border-blue-400";

  return (
    <main
      className={`min-h-screen w-full ${
        isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"
      }`}
    >
      {/* ── HEADER ──────────────────────────────────────────── */}
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
                <Buildings size={14} weight="fill" />
                <span className="font-medium">Department Workspace</span>
              </div>

              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] ${heading}`}
              >
                Manage departments
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  with clarity.
                </span>
              </h1>

              <p className={`mt-4 max-w-xl text-base leading-8 ${body}`}>
                Create, edit, and organize your business units in a clean,
                focused workspace. Keep your org structure sharp.
              </p>
            </div>

            <Button
              onClick={() => {
                setEditingId(null);
                setErrors({});
                setFormData({ departmentCode: "", departmentName: "" });
                setShowModal(true);
              }}
              className="rounded-full px-6 h-11 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-500/20 text-white font-medium"
            >
              <Plus size={17} weight="bold" />
              Add department
            </Button>
          </div>
        </div>
      </section>

      {/* ── SEARCH + STATS BAR ────────────────────────────── */}
      <section className="w-full px-3 sm:px-4 md:px-6 lg:px-10 pb-6 sm:pb-8 pt-4 sm:pt-6 2xl:px-20">
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-stretch">
          {/* Search */}
          <div
            className={`flex-1 flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3 ${card}`}
          >
            <MagnifyingGlass size={15} className={muted} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code or name…"
              className={`flex-1 bg-transparent text-xs sm:text-sm outline-none ${
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
                <X size={13} />
              </button>
            )}
          </div>

          {/* Mini stats */}
          <div className="flex gap-2 sm:gap-3">
            <MiniStat
              isDark={isDark}
              label="Total"
              value={departments.length}
              icon={
                <Buildings size={13} weight="fill" className="text-blue-500" />
              }
            />
          </div>
        </div>
      </section>

      {/* ── TABLE ─────────────────────────────────────────── */}
      <section className="w-full px-3 sm:px-4 md:px-6 lg:px-10 pb-16 md:pb-20 2xl:px-20">
        <Card
          className={`overflow-hidden rounded-xl sm:rounded-2xl border ${
            isDark
              ? "border-white/8 bg-white/3"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <CardHeader
            className={`pb-3 sm:pb-4 px-4 sm:px-6 border-b ${isDark ? "border-white/8" : "border-slate-100"}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle
                  className={`text-lg sm:text-xl font-bold ${heading}`}
                >
                  Department Directory
                </CardTitle>
                <CardDescription className={`mt-1 text-xs sm:text-sm ${muted}`}>
                  Browse, edit, and manage your department records.
                </CardDescription>
              </div>
              {filteredDepartments.length > 0 && (
                <Badge
                  className={`rounded-full border px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold w-fit ${
                    isDark
                      ? "border-white/8 bg-white/5 text-slate-400"
                      : "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-200"
                  }`}
                >
                  {filteredDepartments.length} record
                  {filteredDepartments.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-2 sm:space-y-3 p-3 sm:p-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={`h-12 sm:h-14 w-full rounded-lg sm:rounded-xl ${isDark ? "bg-white/5" : ""}`}
                  />
                ))}
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center">
                <div
                  className={`mb-3 sm:mb-5 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl ${
                    isDark ? "bg-white/5" : "bg-slate-100"
                  }`}
                >
                  <Buildings size={24} className={muted} weight="fill" />
                </div>
                <h3 className={`text-base sm:text-lg font-semibold ${heading}`}>
                  No departments found
                </h3>
                <p
                  className={`mt-2 max-w-sm text-xs sm:text-sm leading-7 ${body}`}
                >
                  {searchTerm
                    ? `No results for "${searchTerm}". Try a different search term.`
                    : "Create your first department to start organizing your workforce."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowModal(true)}
                    className="mt-4 sm:mt-6 rounded-full px-4 sm:px-6 h-9 sm:h-11 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white text-sm"
                  >
                    <Plus size={16} weight="bold" />
                    Add department
                  </Button>
                )}
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className={`mt-3 sm:mt-5 rounded-full px-4 sm:px-5 h-9 sm:h-11 gap-2 text-sm ${
                      isDark ? "border-white/10 bg-white/5 text-white" : ""
                    }`}
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
                      className={`${isDark ? "border-white/8" : "border-slate-100"}`}
                    >
                      <TableHead
                        className={`px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-600"}`}
                      >
                        Code
                      </TableHead>
                      <TableHead
                        className={`px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-600"}`}
                      >
                        Department name
                      </TableHead>
                      <TableHead
                        className={`px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-600"}`}
                      >
                        Created
                      </TableHead>
                      <TableHead
                        className={`text-right px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-600"}`}
                      >
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredDepartments.map((dept, index) => (
                      <TableRow
                        key={dept.departmentId}
                        id={`department-row-${dept.departmentId}`}
                        className={`transition-all duration-300 group animate-slide-up highlight-row ${
                          isDark
                            ? "border-white/8 hover:bg-white/3"
                            : "border-slate-100 hover:bg-slate-50/80"
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <TableCell className="px-3 sm:px-4 py-3 sm:py-4">
                          <Badge
                            className={`rounded-full border px-2 sm:px-3 py-0.5 sm:py-1 font-mono text-[9px] sm:text-xs font-semibold ${
                              isDark
                                ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                                : "border-blue-200 bg-blue-50 text-blue-700"
                            }`}
                          >
                            {dept.departmentCode}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg text-[9px] sm:text-xs font-bold ${
                                isDark
                                  ? "bg-white/8 text-slate-300"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {dept.departmentName.charAt(0).toUpperCase()}
                            </div>
                            <span
                              className={`font-medium text-xs sm:text-sm ${heading}`}
                            >
                              {dept.departmentName}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-3 sm:px-4 py-3 sm:py-4">
                          <div
                            className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${body}`}
                          >
                            <CalendarBlank size={12} className={muted} />
                            {new Date(dept.createdDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(dept)}
                              className={`rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0 flex items-center justify-center ${
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
                              onClick={() => setDeleteTarget(dept)}
                              className={`rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0 flex items-center justify-center ${
                                isDark
                                  ? "border-red-500/20 bg-red-500/8 text-red-400 hover:bg-red-500/15"
                                  : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                              title="Delete"
                            >
                              <Trash size={13} weight="fill" />
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

      {/* ── CREATE / EDIT MODAL ────────────────────────────── */}
      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
          else setShowModal(true);
        }}
      >
        <DialogContent
          className={`overflow-hidden p-0 sm:max-w-md ${
            isDark
              ? "border-white/10 bg-slate-950 text-white"
              : "border-slate-200 bg-white"
          }`}
        >
          {/* Top gradient strip */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent rounded-t-xl" />

          <DialogHeader
            className={isDark ? "border-white/10" : "border-slate-100"}
          >
            <div className="mb-1 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md">
                <Buildings size={18} weight="fill" />
              </div>
              <div>
                <DialogTitle className={`text-lg font-bold ${heading}`}>
                  {editingId ? "Edit department" : "Create department"}
                </DialogTitle>
                <DialogDescription className={`text-xs ${muted}`}>
                  Fill in the department details below.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-5 px-6 py-5">
            <div className="grid gap-2.5">
              <Label
                htmlFor="departmentCode"
                className={`text-sm font-medium ${heading}`}
              >
                Department code
              </Label>
              <Input
                id="departmentCode"
                maxLength={10}
                placeholder="e.g. HR, IT, SALES"
                value={formData.departmentCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    departmentCode: e.target.value.toUpperCase(),
                  }))
                }
                className={`h-11 rounded-xl font-mono uppercase tracking-wider ${
                  errors.departmentCode
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                } ${inputCls}`}
              />
              {errors.departmentCode && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <X size={12} /> {errors.departmentCode}
                </p>
              )}
            </div>

            <div className="grid gap-2.5">
              <Label
                htmlFor="departmentName"
                className={`text-sm font-medium ${heading}`}
              >
                Department name
              </Label>
              <Input
                id="departmentName"
                placeholder="e.g. Human Resources"
                value={formData.departmentName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    departmentName: e.target.value,
                  }))
                }
                className={`h-11 rounded-xl ${
                  errors.departmentName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                } ${inputCls}`}
              />
              {errors.departmentName && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <X size={12} /> {errors.departmentName}
                </p>
              )}
            </div>
          </div>

          <DialogFooter
            className={`gap-3 ${isDark ? "border-white/10" : "border-slate-100"}`}
          >
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className={`h-11 rounded-full flex-1 ${
                isDark
                  ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  : ""
              }`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-11 rounded-full flex-1 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 text-white shadow-md"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {editingId ? "Updating…" : "Creating…"}
                </span>
              ) : (
                <>
                  <CheckCircle size={15} weight="fill" />
                  {editingId ? "Update department" : "Create department"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DELETE DIALOG ─────────────────────────────────── */}
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
              Delete department?
            </AlertDialogTitle>
            <AlertDialogDescription
              className={`mx-auto max-w-sm text-center text-sm leading-7 ${body}`}
            >
              This will permanently remove{" "}
              <span className={`font-semibold ${heading}`}>
                {deleteTarget?.departmentName}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter
            className={`gap-2.5 p-5 ${isDark ? "border-white/10" : "border-slate-100"}`}
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
              Delete department
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster position="top-right" theme={isDark ? "dark" : "light"} />
    </main>
  );
}

function MiniStat({
  isDark,
  label,
  value,
  icon,
  highlight = false,
}: {
  isDark: boolean;
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 min-w-[100px] transition-all ${
        highlight
          ? isDark
            ? "border-violet-500/25 bg-violet-500/8"
            : "border-violet-200 bg-violet-50"
          : isDark
            ? "border-white/8 bg-white/3"
            : "border-slate-200 bg-white shadow-sm"
      }`}
    >
      {icon}
      <div>
        <p
          className={`text-[10px] font-medium uppercase tracking-wide ${isDark ? "text-slate-500" : "text-slate-400"}`}
        >
          {label}
        </p>
        <p
          className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
