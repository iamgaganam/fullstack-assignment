import { useEffect, useState } from "react";
import { departmentAPI } from "@/api";
import {
  Trash,
  PencilSimple,
  Plus,
  XCircle,
  Check,
} from "@phosphor-icons/react";
import { Toaster, toast } from "sonner";

interface Department {
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  createdDate: string;
  modifiedDate: string;
}

interface DepartmentFormProps {
  isDark: boolean;
}

interface FormData {
  departmentCode: string;
  departmentName: string;
}

export function DepartmentPage({ isDark }: DepartmentFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<FormData>({
    departmentCode: "",
    departmentName: "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.departmentCode.trim()) {
      newErrors.departmentCode = "Department Code is required";
    }
    if (!formData.departmentName.trim()) {
      newErrors.departmentName = "Department Name is required";
    }

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
        toast.success("Department updated successfully!");
      } else {
        await departmentAPI.create(formData);
        toast.success("Department created successfully!");
      }

      setShowModal(false);
      setFormData({ departmentCode: "", departmentName: "" });
      setEditingId(null);
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
    setShowModal(true);
    setErrors({});
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await departmentAPI.delete(id);
        setDepartments(departments.filter((d) => d.departmentId !== id));
        toast.success("Department deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete department");
        console.error(error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ departmentCode: "", departmentName: "" });
    setEditingId(null);
    setErrors({});
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.departmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Departments Management
          </h1>
          <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Create, manage, and organize your departments efficiently.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <button
            onClick={() => {
              setFormData({ departmentCode: "", departmentName: "" });
              setEditingId(null);
              setShowModal(true);
              setErrors({});
            }}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            <Plus size={20} weight="bold" />
            <span>Add Department</span>
          </button>
        </div>

        {/* Table */}
        <div
          className={`rounded-lg border overflow-hidden ${
            isDark
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          } shadow-lg`}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div
              className={`py-12 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              <p className="text-lg">No departments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? "bg-slate-800" : "bg-slate-100"}>
                  <tr>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Department Code
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Department Name
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Created Date
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? "divide-slate-700" : "divide-slate-200"
                  }`}
                >
                  {filteredDepartments.map((dept) => (
                    <tr
                      key={dept.departmentId}
                      className={`transition-colors hover:${
                        isDark ? "bg-slate-800" : "bg-slate-50"
                      }`}
                    >
                      <td
                        className={`px-6 py-4 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <span className="font-mono font-semibold text-blue-500">
                          {dept.departmentCode}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {dept.departmentName}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {new Date(dept.createdDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(dept)}
                            className={`p-2 rounded-lg transition-colors ${
                              isDark
                                ? "bg-slate-800 hover:bg-slate-700 text-blue-400"
                                : "bg-slate-100 hover:bg-slate-200 text-blue-600"
                            }`}
                            title="Edit"
                          >
                            <PencilSimple size={18} weight="fill" />
                          </button>
                          <button
                            onClick={() => handleDelete(dept.departmentId)}
                            className={`p-2 rounded-lg transition-colors ${
                              isDark
                                ? "bg-slate-800 hover:bg-slate-700 text-red-400"
                                : "bg-slate-100 hover:bg-slate-200 text-red-600"
                            }`}
                            title="Delete"
                          >
                            <Trash size={18} weight="fill" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-lg shadow-2xl w-full max-w-md ${
              isDark ? "bg-slate-900" : "bg-white"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`flex justify-between items-center px-6 py-4 border-b ${
                isDark ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {editingId ? "Edit Department" : "Add Department"}
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className={`p-1 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-slate-800 text-slate-400 hover:text-slate-300"
                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                <XCircle size={24} weight="bold" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Department Code */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Department Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g., HR, IT, SALES"
                  maxLength={10}
                  value={formData.departmentCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      departmentCode: e.target.value.toUpperCase(),
                    })
                  }
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    errors.departmentCode
                      ? isDark
                        ? "border-red-600 bg-slate-800"
                        : "border-red-400 bg-red-50"
                      : isDark
                        ? "border-slate-600 bg-slate-800"
                        : "border-slate-300 bg-slate-50"
                  } ${isDark ? "text-white" : "text-slate-900"} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                />
                {errors.departmentCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.departmentCode}
                  </p>
                )}
              </div>

              {/* Department Name */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Department Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Human Resources"
                  value={formData.departmentName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      departmentName: e.target.value,
                    })
                  }
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    errors.departmentName
                      ? isDark
                        ? "border-red-600 bg-slate-800"
                        : "border-red-400 bg-red-50"
                      : isDark
                        ? "border-slate-600 bg-slate-800"
                        : "border-slate-300 bg-slate-50"
                  } ${isDark ? "text-white" : "text-slate-900"} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                />
                {errors.departmentName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.departmentName}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={`flex justify-end gap-3 px-6 py-4 border-t ${
                isDark ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <Check size={18} weight="bold" />
                <span>{editingId ? "Update" : "Create"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" theme={isDark ? "dark" : "light"} />
    </div>
  );
}
