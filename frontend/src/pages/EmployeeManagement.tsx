import { useEffect, useMemo, useState } from "react";
import { employeeAPI, departmentAPI } from "../api";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Edit3,
  Mail,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

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

type AlertState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const formatDateForInput = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  dateOfBirth: "",
  salary: 0,
  departmentId: 0,
};

function StatCard({
  title,
  value,
  subtext,
  icon,
}: {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.92)
            : "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "text.secondary",
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.6rem", md: "1.9rem" },
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "text.primary",
              lineHeight: 1.1,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {subtext}
          </Typography>
        </Box>

        <Avatar
          variant="rounded"
          sx={{
            width: 46,
            height: 46,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Paper>
  );
}

export function EmployeeManagement() {
  const theme = useTheme();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "success",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<number | "all">(
    "all",
  );

  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const maxDateOfBirth = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatDateForInput(d);
  })();

  useEffect(() => {
    fetchData();
  }, []);

  const showAlert = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, deptData] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
      ]);
      setEmployees(empData);
      setDepartments(deptData);
    } catch (err) {
      showAlert(
        err instanceof Error ? err.message : "Failed to fetch employees",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getDeptName = (id: number) =>
    departments.find((d) => d.departmentId === id)?.departmentName ?? "—";

  const getDeptCode = (id: number) =>
    departments.find((d) => d.departmentId === id)?.departmentCode ?? "";

  const getInitials = (first: string, last: string) =>
    `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

  const validateForm = () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.emailAddress.trim() ||
      !formData.dateOfBirth ||
      formData.salary < 0 ||
      formData.departmentId === 0
    ) {
      return "All fields are required and must be valid";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      return "Please enter a valid email address";
    }

    if (new Date(formData.dateOfBirth) >= new Date()) {
      return "Date of birth must be in the past";
    }

    return null;
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      showAlert(validationMessage, "error");
      return;
    }

    try {
      setSubmitting(true);

      if (editingId !== null) {
        await employeeAPI.update(editingId, {
          employeeId: editingId,
          age: calculateAge(formData.dateOfBirth),
          ...formData,
        });
        showAlert("Employee updated successfully", "success");
      } else {
        await employeeAPI.create(formData);
        showAlert("Employee created successfully", "success");
      }

      setIsFormOpen(false);
      resetForm();
      await fetchData();
    } catch (err) {
      showAlert(
        err instanceof Error ? err.message : "Failed to save employee",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (emp: Employee) => {
    setEditingId(emp.employeeId);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      emailAddress: emp.emailAddress,
      dateOfBirth: emp.dateOfBirth.split("T")[0],
      salary: emp.salary,
      departmentId: emp.departmentId,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await employeeAPI.delete(deleteTarget.employeeId);
      showAlert("Employee deleted successfully", "success");
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      showAlert(
        err instanceof Error ? err.message : "Failed to delete employee",
        "error",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const openAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const email = emp.emailAddress.toLowerCase();
      const deptName = getDeptName(emp.departmentId).toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      const matchesQuery =
        !query ||
        fullName.includes(query) ||
        email.includes(query) ||
        deptName.includes(query);

      const matchesDepartment =
        departmentFilter === "all" || emp.departmentId === departmentFilter;

      return matchesQuery && matchesDepartment;
    });
  }, [employees, searchQuery, departmentFilter, departments]);

  const totalEmployees = employees.length;
  const avgSalary =
    employees.length > 0
      ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
      : 0;
  const avgAge =
    employees.length > 0
      ? Math.round(
          employees.reduce((sum, emp) => sum + emp.age, 0) / employees.length,
        )
      : 0;
  const activeDepartments = new Set(employees.map((emp) => emp.departmentId))
    .size;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(
                theme.palette.primary.dark,
                0.08,
              )} 100%)`
            : "linear-gradient(180deg, #f8fafc 0%, #ffffff 35%, #f5f9ff 100%)",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Hero Header */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, md: 4.5 },
            mb: 4,
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1,
            )} 0%, ${alpha(theme.palette.info.main, 0.08)} 100%)`,
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: -80,
              right: -60,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(
                theme.palette.primary.main,
                0.16,
              )} 0%, transparent 68%)`,
            }}
          />

          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "center" }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box>
              <Chip
                icon={<Sparkles size={14} />}
                label="Employee Management"
                sx={{
                  mb: 1.5,
                  borderRadius: 999,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: "2rem", md: "2.8rem" },
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                  color: "text.primary",
                  mb: 1,
                }}
              >
                Your employee workspace,
                <br />
                beautifully organised.
              </Typography>

              <Typography
                sx={{
                  maxWidth: 700,
                  color: "text.secondary",
                  lineHeight: 1.8,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                }}
              >
                Manage personnel records, salaries, ages, and department
                assignments from a cleaner, faster, and more professional
                interface.
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={openAdd}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Add Employee
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <StatCard
            title="Total Employees"
            value={`${totalEmployees}`}
            subtext="All personnel records"
            icon={<Users size={20} />}
          />
          <StatCard
            title="Average Salary"
            value={formatCurrency(avgSalary)}
            subtext="Across all employees"
            icon={<DollarSign size={20} />}
          />
          <StatCard
            title="Average Age"
            value={`${avgAge}`}
            subtext="Calculated from date of birth"
            icon={<CalendarDays size={20} />}
          />
          <StatCard
            title="Active Departments"
            value={`${activeDepartments}`}
            subtext="Departments with employees"
            icon={<BriefcaseBusiness size={20} />}
          />
        </Box>

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            background: alpha(theme.palette.background.paper, 0.8),
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <TextField
              fullWidth
              placeholder="Search by name, email, or department"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              label="Department"
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              sx={{ minWidth: { xs: "100%", md: 240 } }}
            >
              <MenuItem value="all">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Paper>

        {/* Content */}
        {loading ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              borderRadius: 5,
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              textAlign: "center",
            }}
          >
            <CircularProgress />
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              Loading employees...
            </Typography>
          </Paper>
        ) : employees.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: 5,
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              textAlign: "center",
              background:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.9)
                  : "#ffffff",
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                mx: "auto",
                mb: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
              }}
            >
              <Users size={34} />
            </Avatar>

            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              No employees yet
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 3 }}>
              Create your first employee record to get started.
            </Typography>

            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={openAdd}
              sx={{
                minHeight: 46,
                px: 2.5,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Add Employee
            </Button>
          </Paper>
        ) : filteredEmployees.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 7 },
              borderRadius: 5,
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.3rem",
                fontWeight: 800,
                mb: 1,
              }}
            >
              No matching employees
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 3 }}>
              Try a different search term or change the department filter.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery("");
                setDepartmentFilter("all");
              }}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                xl: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {filteredEmployees.map((emp) => (
              <Card
                key={emp.employeeId}
                elevation={0}
                sx={{
                  borderRadius: 5,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  background:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.92)
                      : "#ffffff",
                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 22px 40px ${alpha(
                      theme.palette.primary.main,
                      0.12,
                    )}`,
                    borderColor: alpha(theme.palette.primary.main, 0.24),
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "flex-start" }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3.5,
                          fontWeight: 800,
                          fontSize: "1rem",
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                        }}
                      >
                        {getInitials(emp.firstName, emp.lastName)}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          spacing={1}
                          alignItems={{ xs: "flex-start", md: "center" }}
                          sx={{ mb: 1 }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1.1rem",
                              fontWeight: 800,
                              color: "text.primary",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {emp.firstName} {emp.lastName}
                          </Typography>

                          {getDeptCode(emp.departmentId) && (
                            <Chip
                              size="small"
                              label={getDeptCode(emp.departmentId)}
                              sx={{
                                fontWeight: 700,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                borderRadius: 999,
                              }}
                            />
                          )}
                        </Stack>

                        <Typography
                          sx={{
                            color: "text.secondary",
                            mb: 2,
                            fontWeight: 500,
                          }}
                        >
                          {getDeptName(emp.departmentId)}
                        </Typography>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "repeat(2, minmax(0, 1fr))",
                            },
                            gap: 1.25,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Mail
                              size={16}
                              color={theme.palette.text.secondary}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {emp.emailAddress}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CalendarDays
                              size={16}
                              color={theme.palette.text.secondary}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              Age: {emp.age}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <DollarSign
                              size={16}
                              color={theme.palette.text.secondary}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              {formatCurrency(emp.salary)}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CheckCircle2
                              size={16}
                              color={theme.palette.success.main}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              Updated{" "}
                              {new Date(emp.modifiedDate).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit employee">
                        <IconButton
                          onClick={() => handleEdit(emp)}
                          sx={{
                            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                            borderRadius: 3,
                          }}
                        >
                          <Edit3 size={18} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete employee">
                        <IconButton
                          onClick={() => setDeleteTarget(emp)}
                          sx={{
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                            borderRadius: 3,
                            color: theme.palette.error.main,
                          }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Create / Edit Dialog */}
      <Dialog
        open={isFormOpen}
        onClose={submitting ? undefined : handleCancelForm}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1.5 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  borderRadius: 3,
                }}
              >
                <Users size={18} />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
                  {editingId ? "Edit Employee" : "New Employee"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Enter employee details below
                </Typography>
              </Box>
            </Stack>

            <IconButton onClick={handleCancelForm} disabled={submitting}>
              <X size={18} />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                inputProps={{ maxLength: 50 }}
                fullWidth
                required
              />

              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                inputProps={{ maxLength: 50 }}
                fullWidth
                required
              />

              <TextField
                label="Email Address"
                type="email"
                value={formData.emailAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emailAddress: e.target.value,
                  }))
                }
                inputProps={{ maxLength: 100 }}
                fullWidth
                required
                sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}
              />

              <TextField
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dateOfBirth: e.target.value,
                  }))
                }
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: "1900-01-01",
                  max: maxDateOfBirth,
                }}
                helperText={
                  formData.dateOfBirth
                    ? `Calculated age: ${calculateAge(formData.dateOfBirth)}`
                    : " "
                }
              />

              <TextField
                select
                label="Department"
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    departmentId: Number(e.target.value),
                  }))
                }
                fullWidth
                required
              >
                <MenuItem value={0}>Select department</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Salary"
                type="number"
                value={formData.salary || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salary: e.target.value ? Number(e.target.value) : 0,
                  }))
                }
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
            <Button
              onClick={handleCancelForm}
              variant="outlined"
              disabled={submitting}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                minWidth: 140,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              {submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : editingId ? (
                "Update Employee"
              ) : (
                "Create Employee"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={deleteLoading ? undefined : () => setDeleteTarget(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 5,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Employee</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>
            {deleteTarget
              ? `Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            variant="outlined"
            disabled={deleteLoading}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              minWidth: 110,
            }}
          >
            {deleteLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
