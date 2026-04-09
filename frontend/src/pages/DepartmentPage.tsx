import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { departmentAPI } from "@/api";
import type { Department, DepartmentFormData, PageProps } from "@/types";
import {
  Buildings,
  CalendarBlank,
  PencilSimple,
  Trash,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { LoadingState } from "@/components/LoadingState";
import { FormField } from "@/components/FormField";

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
      <PageHeader
        isDark={isDark}
        icon={<Buildings size={14} weight="fill" />}
        badge="Department Workspace"
        title="Manage departments"
        subtitle="with clarity."
        onAddClick={() => {
          setEditingId(null);
          setErrors({});
          setFormData({ departmentCode: "", departmentName: "" });
          setShowModal(true);
        }}
        addButtonLabel="Add department"
      />

      {/* ── SEARCH + STATS BAR ────────────────────────────── */}
      <section className="w-full px-3 sm:px-4 md:px-6 lg:px-10 pb-6 sm:pb-8 pt-4 sm:pt-6 2xl:px-20">
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-stretch">
          {/* Search */}
          <SearchBar
            isDark={isDark}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search by code or name…"
          />

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
          className={`overflow-hidden rounded-xl sm:rounded-2xl border ${card}`}
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
              <LoadingState isDark={isDark} count={6} />
            ) : filteredDepartments.length === 0 ? (
              <EmptyState
                isDark={isDark}
                icon={<Buildings size={24} weight="fill" />}
                title="No departments found"
                message={
                  searchTerm
                    ? `No results for "${searchTerm}". Try a different search term.`
                    : "Create your first department to start organizing your workforce."
                }
                searchTerm={searchTerm}
                onAddClick={() => setShowModal(true)}
                onClearSearch={() => setSearchTerm("")}
                addButtonLabel="Add department"
              />
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
            <FormField
              label="Department code"
              error={errors.departmentCode}
              isDark={isDark}
            >
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
                className={`h-11 rounded-xl font-mono uppercase tracking-wider ${inputCls}`}
              />
            </FormField>

            <FormField
              label="Department name"
              error={errors.departmentName}
              isDark={isDark}
            >
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
                className={`h-11 rounded-xl ${inputCls}`}
              />
            </FormField>
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
      <ConfirmDeleteDialog
        isDark={isDark}
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.departmentName || ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

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
