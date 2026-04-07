import { useEffect, useState } from "react";
import { employeeAPI, departmentAPI } from "@/api";
import {
  Trash,
  PencilSimple,
  Plus,
  XCircle,
  Check,
} from "@phosphor-icons/react";
import { Toaster, toast } from "sonner";

interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: string;
  age: number;
  salary: number;
  departmentId: number;
  createdDate: string;
  modifiedDate: string;
}

interface Department {
  departmentId: number;
  departmentCode: string;
  departmentName: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: string;
  salary: number;
  departmentId: number;
}

interface EmployeePageProps {
  isDark: boolean;
}

export function EmployeePage({ isDark }: EmployeePageProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<FormData>({
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
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required";
    } else {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 18) {
        newErrors.dateOfBirth = "Employee must be at least 18 years old";
      }
    }
    if (formData.salary <= 0) {
      newErrors.salary = "Salary must be greater than 0";
    }
    if (formData.departmentId === 0) {
      newErrors.departmentId = "Department is required";
    }

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
        toast.success("Employee updated successfully!");
      } else {
        await employeeAPI.create(submitData);
        toast.success("Employee created successfully!");
      }

      setShowModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        emailAddress: "",
        dateOfBirth: "",
        salary: 0,
        departmentId: 0,
      });
      setEditingId(null);
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
    setShowModal(true);
    setErrors({});
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeAPI.delete(id);
        setEmployees(employees.filter((e) => e.employeeId !== id));
        toast.success("Employee deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete employee");
        console.error(error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      firstName: "",
      lastName: "",
      emailAddress: "",
      dateOfBirth: "",
      salary: 0,
      departmentId: 0,
    });
    setEditingId(null);
    setErrors({});
  };

  const getDepartmentName = (deptId: number): string => {
    return (
      departments.find((d) => d.departmentId === deptId)?.departmentName ||
      "N/A"
    );
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()),
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
            Employees Management
          </h1>
          <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Manage employee information, salaries, and department assignments.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Search employees..."
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
              setFormData({
                firstName: "",
                lastName: "",
                emailAddress: "",
                dateOfBirth: "",
                salary: 0,
                departmentId: 0,
              });
              setEditingId(null);
              setShowModal(true);
              setErrors({});
            }}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            <Plus size={20} weight="bold" />
            <span>Add Employee</span>
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div
              className={`py-12 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              <p className="text-lg">No employees found</p>
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
                      Name
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Email
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Age / DOB
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Department
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Salary
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
                  {filteredEmployees.map((emp) => (
                    <tr
                      key={emp.employeeId}
                      className={`transition-colors hover:${
                        isDark ? "bg-slate-800" : "bg-slate-50"
                      }`}
                    >
                      <td
                        className={`px-6 py-4 font-medium ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <div>
                          <p className="font-semibold">
                            {emp.firstName} {emp.lastName}
                          </p>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {emp.emailAddress}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-blue-500">
                            {emp.age} years
                          </p>
                          <p className="text-xs">
                            {new Date(emp.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isDark
                              ? "bg-purple-900/50 text-purple-300"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {getDepartmentName(emp.departmentId)}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        $
                        {emp.salary.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(emp)}
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
                            onClick={() => handleDelete(emp.employeeId)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div
            className={`rounded-lg shadow-2xl w-full max-w-2xl my-8 ${
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
                {editingId ? "Edit Employee" : "Add Employee"}
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
            <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      errors.firstName
                        ? isDark
                          ? "border-red-600 bg-slate-800"
                          : "border-red-400 bg-red-50"
                        : isDark
                          ? "border-slate-600 bg-slate-800"
                          : "border-slate-300 bg-slate-50"
                    } ${isDark ? "text-white" : "text-slate-900"} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      errors.lastName
                        ? isDark
                          ? "border-red-600 bg-slate-800"
                          : "border-red-400 bg-red-50"
                        : isDark
                          ? "border-slate-600 bg-slate-800"
                          : "border-slate-300 bg-slate-50"
                    } ${isDark ? "text-white" : "text-slate-900"} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.emailAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, emailAddress: e.target.value })
                  }
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    errors.emailAddress
                      ? isDark
                        ? "border-red-600 bg-slate-800"
                        : "border-red-400 bg-red-50"
                      : isDark
                        ? "border-slate-600 bg-slate-800"
                        : "border-slate-300 bg-slate-50"
                  } ${isDark ? "text-white" : "text-slate-900"} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                />
                {errors.emailAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.emailAddress}
                  </p>
                )}
              </div>

              {/* DOB & Salary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      errors.dateOfBirth
                        ? isDark
                          ? "border-red-600 bg-slate-800"
                          : "border-red-400 bg-red-50"
                        : isDark
                          ? "border-slate-600 bg-slate-800"
                          : "border-slate-300 bg-slate-50"
                    } ${isDark ? "text-white" : "text-slate-900"} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    value={calculateAge(formData.dateOfBirth)}
                    disabled
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? "border-slate-600 bg-slate-700 text-slate-400"
                        : "border-slate-300 bg-slate-100 text-slate-500"
                    } focus:outline-none disabled:opacity-50`}
                  />
                </div>
              </div>

              {/* Salary & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Salary *
                  </label>
                  <input
                    type="number"
                    placeholder="50000"
                    step="100"
                    value={formData.salary || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary: parseFloat(e.target.value) || 0,
                      })
                    }
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      errors.salary
                        ? isDark
                          ? "border-red-600 bg-slate-800"
                          : "border-red-400 bg-red-50"
                        : isDark
                          ? "border-slate-600 bg-slate-800"
                          : "border-slate-300 bg-slate-50"
                    } ${isDark ? "text-white" : "text-slate-900"} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                  />
                  {errors.salary && (
                    <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Department *
                  </label>
                  <select
                    value={formData.departmentId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departmentId: parseInt(e.target.value),
                      })
                    }
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      errors.departmentId
                        ? isDark
                          ? "border-red-600 bg-slate-800"
                          : "border-red-400 bg-red-50"
                        : isDark
                          ? "border-slate-600 bg-slate-800"
                          : "border-slate-300 bg-slate-50"
                    } ${isDark ? "text-white" : "text-slate-900"} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.departmentId}
                    </p>
                  )}
                </div>
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
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
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
