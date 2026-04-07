import { useEffect, useMemo, useState } from "react";
import { departmentAPI } from "../api";
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
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Hash,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

interface Department {
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  createdDate: string;
  modifiedDate: string;
}

interface FormData {
  departmentCode: string;
  departmentName: string;
}

type AlertState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const emptyForm: FormData = {
  departmentCode: "",
  departmentName: "",
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

export function DepartmentManagement() {
  const theme = useTheme();

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

  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
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

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentAPI.getAll();
      setDepartments(data);
    } catch (err) {
      showAlert(
        err instanceof Error ? err.message : "Failed to fetch departments",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.departmentCode.trim() || !formData.departmentName.trim()) {
      return "All fields are required";
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

      const payload = {
        departmentCode: formData.departmentCode.trim().toUpperCase(),
        departmentName: formData.departmentName.trim(),
      };

      if (editingId !== null) {
        await departmentAPI.update(editingId, {
          departmentId: editingId,
          ...payload,
        });
        showAlert("Department updated successfully", "success");
      } else {
        await departmentAPI.create(payload);
        showAlert("Department created successfully", "success");
      }

      setIsFormOpen(false);
      resetForm();
      await fetchDepartments();
    } catch (err) {
      showAlert(
        err instanceof Error ? err.message : "Failed to save department",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (dept: Department) => {
    setEditingId(dept.departmentId);
    setFormData({
      departmentCode: dept.departmentCode,
      departmentName: dept.departmentName,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await departmentAPI.delete(deleteTarget.departmentId);
      showAlert("Department deleted successfully", "success");
      setDeleteTarget(null);
      await fetchDepartments();
    } catch (err) {
      showAlert(
        err instanceof Error ? err.message : "Failed to delete department",
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

  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return departments.filter((dept) => {
      if (!query) return true;

      return (
        dept.departmentName.toLowerCase().includes(query) ||
        dept.departmentCode.toLowerCase().includes(query)
      );
    });
  }, [departments, searchQuery]);

  const totalDepartments = departments.length;

  const codedDepartments = departments.filter(
    (dept) => dept.departmentCode.trim().length > 0,
  ).length;

  const recentlyUpdated = departments.filter((dept) => {
    const modified = new Date(dept.modifiedDate).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return modified >= thirtyDaysAgo;
  }).length;

  const latestModifiedDepartment = departments
    .slice()
    .sort(
      (a, b) =>
        new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime(),
    )[0];

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
                label="Department Management"
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
                Build your organisation
                <br />
                with a cleaner structure.
              </Typography>

              <Typography
                sx={{
                  maxWidth: 700,
                  color: "text.secondary",
                  lineHeight: 1.8,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                }}
              >
                Create, edit, and organise department records from a polished
                interface that feels modern, clear, and much more professional.
              </Typography>
            </Box>

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
              Add Department
            </Button>
          </Stack>
        </Paper>

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
            title="Total Departments"
            value={`${totalDepartments}`}
            subtext="All department records"
            icon={<Building2 size={20} />}
          />
          <StatCard
            title="Department Codes"
            value={`${codedDepartments}`}
            subtext="Departments with code labels"
            icon={<Hash size={20} />}
          />
          <StatCard
            title="Recently Updated"
            value={`${recentlyUpdated}`}
            subtext="Modified in the last 30 days"
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            title="Latest Change"
            value={
              latestModifiedDepartment
                ? latestModifiedDepartment.departmentCode || "—"
                : "—"
            }
            subtext={
              latestModifiedDepartment
                ? latestModifiedDepartment.departmentName
                : "No recent activity"
            }
            icon={<CalendarDays size={20} />}
          />
        </Box>

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
          <TextField
            fullWidth
            placeholder="Search by department name or code"
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
        </Paper>

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
              Loading departments...
            </Typography>
          </Paper>
        ) : departments.length === 0 ? (
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
              <Building2 size={34} />
            </Avatar>

            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              No departments yet
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 3 }}>
              Create your first department to start structuring your
              organisation.
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
              Add Department
            </Button>
          </Paper>
        ) : filteredDepartments.length === 0 ? (
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
              No matching departments
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 3 }}>
              Try another search term for code or department name.
            </Typography>

            <Button
              variant="outlined"
              onClick={() => setSearchQuery("")}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Clear Search
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {filteredDepartments.map((dept) => (
              <Card
                key={dept.departmentId}
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
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: 3.5,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                          }}
                        >
                          <Building2 size={22} />
                        </Avatar>

                        <Box>
                          <Typography
                            sx={{
                              fontSize: "1.08rem",
                              fontWeight: 800,
                              color: "text.primary",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {dept.departmentName}
                          </Typography>

                          <Chip
                            size="small"
                            label={dept.departmentCode}
                            sx={{
                              mt: 0.75,
                              fontWeight: 700,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              borderRadius: 999,
                            }}
                          />
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit department">
                          <IconButton
                            onClick={() => handleEdit(dept)}
                            sx={{
                              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                              borderRadius: 3,
                            }}
                          >
                            <Edit3 size={18} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete department">
                          <IconButton
                            onClick={() => setDeleteTarget(dept)}
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

                    <Box
                      sx={{
                        display: "grid",
                        gap: 1.2,
                        pt: 1,
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarDays
                          size={16}
                          color={theme.palette.text.secondary}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Created{" "}
                          {new Date(dept.createdDate).toLocaleDateString()}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircle2
                          size={16}
                          color={theme.palette.success.main}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Updated{" "}
                          {new Date(dept.modifiedDate).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

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
                <Building2 size={18} />
              </Avatar>

              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
                  {editingId ? "Edit Department" : "New Department"}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Enter department details below
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
            <Stack spacing={2}>
              <TextField
                label="Department Code"
                value={formData.departmentCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    departmentCode: e.target.value.toUpperCase(),
                  }))
                }
                inputProps={{ maxLength: 50 }}
                fullWidth
                required
                helperText="Example: IT, HR, FIN"
              />

              <TextField
                label="Department Name"
                value={formData.departmentName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    departmentName: e.target.value,
                  }))
                }
                inputProps={{ maxLength: 100 }}
                fullWidth
                required
                helperText="Example: Information Technology"
              />
            </Stack>
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
                minWidth: 150,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              {submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : editingId ? (
                "Update Department"
              ) : (
                "Create Department"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

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
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Department</DialogTitle>

        <DialogContent>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>
            {deleteTarget
              ? `Are you sure you want to delete ${deleteTarget.departmentName}? This action cannot be undone.`
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
