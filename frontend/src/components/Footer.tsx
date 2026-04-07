import { Link as RouterLink } from "react-router-dom";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  Building2,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  FileText,
  Home,
} from "lucide-react";

export function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: "Home", to: "/", icon: <Home size={16} /> },
    { label: "Departments", to: "/departments", icon: <Building2 size={16} /> },
    { label: "Employees", to: "/employees", icon: <Users size={16} /> },
  ];

  const supportLinks = [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "System Status", href: "#" },
  ];

  const legalLinks = [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookies", href: "#" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${alpha(
                theme.palette.background.paper,
                0.45,
              )} 0%, ${theme.palette.background.default} 100%)`
            : `linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)`,
      }}
    >
      {/* Decorative glow */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.16,
          )} 0%, transparent 72%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: -120,
          left: -120,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.info.main,
            0.12,
          )} 0%, transparent 72%)`,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* CTA band */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            mb: 5,
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1,
            )} 0%, ${alpha(theme.palette.info.main, 0.08)} 100%)`,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Chip
                icon={<Sparkles size={14} />}
                label="Professional Workspace"
                sx={{
                  mb: 1.5,
                  borderRadius: 999,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  mb: 1,
                }}
              >
                Ready to manage your organisation better?
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  maxWidth: 620,
                  lineHeight: 1.75,
                }}
              >
                Use one clean, modern interface to manage departments,
                employees, and your core people operations with confidence.
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                component={RouterLink}
                to="/departments"
                variant="contained"
                startIcon={<Building2 size={16} />}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Manage Departments
              </Button>
              <Button
                component={RouterLink}
                to="/employees"
                variant="outlined"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                }}
              >
                Open Employees
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Main footer */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1.2fr 1fr",
              lg: "1.3fr 0.9fr 0.9fr 1.1fr",
            },
            gap: { xs: 3, md: 4 },
            pb: 5,
          }}
        >
          {/* Brand */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 5,
              border: `1px solid ${alpha(theme.palette.divider, 0.75)}`,
              background: alpha(theme.palette.background.paper, 0.72),
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3.5,
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                  boxShadow: `0 14px 28px ${alpha(
                    theme.palette.primary.main,
                    0.24,
                  )}`,
                }}
              >
                <Building2 size={24} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "1.05rem",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  Company Management
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: theme.palette.text.secondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 700,
                  }}
                >
                  Smart HR Workspace
                </Typography>
              </Box>
            </Stack>

            <Typography
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.8,
                mb: 2.5,
                fontSize: "0.95rem",
              }}
            >
              A modern system for managing departments, employees, and internal
              workflows with a cleaner and more professional user experience.
            </Typography>

            <Stack direction="row" spacing={1.25} mb={2.5}>
              <IconButton
                component="a"
                href="mailto:info@company.com"
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <Mail size={18} />
              </IconButton>

              <IconButton
                component="a"
                href="tel:+1234567890"
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <Phone size={18} />
              </IconButton>

              <IconButton
                component="a"
                href="#"
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <ShieldCheck size={18} />
              </IconButton>
            </Stack>

            <Chip
              icon={<Sparkles size={14} />}
              label="Built for clarity, scale, and control"
              sx={{
                borderRadius: 999,
                fontWeight: 700,
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
              }}
            />
          </Paper>

          {/* Navigation */}
          <Box>
            <Typography
              sx={{
                mb: 2,
                fontSize: "0.78rem",
                fontWeight: 800,
                color: theme.palette.text.primary,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              Navigation
            </Typography>

            <Stack spacing={1.2}>
              {navLinks.map((item) => (
                <MuiLink
                  key={item.label}
                  component={RouterLink}
                  to={item.to}
                  underline="none"
                  color="inherit"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.2,
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: theme.palette.text.primary,
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {item.icon}
                  </Box>
                  {item.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          {/* Support */}
          <Box>
            <Typography
              sx={{
                mb: 2,
                fontSize: "0.78rem",
                fontWeight: 800,
                color: theme.palette.text.primary,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              Support
            </Typography>

            <Stack spacing={1.2}>
              {supportLinks.map((item) => (
                <MuiLink
                  key={item.label}
                  href={item.href}
                  underline="none"
                  color="inherit"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.2,
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: theme.palette.text.primary,
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <FileText size={16} />
                  {item.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          {/* Contact */}
          <Box>
            <Typography
              sx={{
                mb: 2,
                fontSize: "0.78rem",
                fontWeight: 800,
                color: theme.palette.text.primary,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              Contact
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" spacing={1.4} alignItems="flex-start">
                <Box
                  sx={{
                    mt: 0.25,
                    color: theme.palette.primary.main,
                    display: "flex",
                  }}
                >
                  <Mail size={18} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 0.3 }}>
                    Email
                  </Typography>
                  <MuiLink
                    href="mailto:info@company.com"
                    underline="hover"
                    color="inherit"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    info@company.com
                  </MuiLink>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.4} alignItems="flex-start">
                <Box
                  sx={{
                    mt: 0.25,
                    color: theme.palette.primary.main,
                    display: "flex",
                  }}
                >
                  <Phone size={18} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 0.3 }}>
                    Phone
                  </Typography>
                  <MuiLink
                    href="tel:+1234567890"
                    underline="hover"
                    color="inherit"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    +1 (234) 567-890
                  </MuiLink>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.4} alignItems="flex-start">
                <Box
                  sx={{
                    mt: 0.25,
                    color: theme.palette.primary.main,
                    display: "flex",
                  }}
                >
                  <MapPin size={18} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 0.3 }}>
                    Address
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.secondary }}>
                    123 Business St, City, Country
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.75) }} />

        {/* Bottom bar */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          sx={{ py: 3 }}
        >
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.92rem",
              lineHeight: 1.7,
            }}
          >
            © {currentYear}{" "}
            <Box
              component="span"
              sx={{ fontWeight: 800, color: "text.primary" }}
            >
              Company Management System
            </Box>
            . All rights reserved.
          </Typography>

          <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.92rem",
              flexWrap: "wrap",
            }}
          >
            <Typography component="span" sx={{ fontSize: "inherit" }}>
              Built with
            </Typography>
            <Heart size={15} fill="currentColor" color="#ef4444" />
            <Typography component="span" sx={{ fontSize: "inherit" }}>
              using
            </Typography>
            <Box
              component="span"
              sx={{ fontWeight: 800, color: "text.primary" }}
            >
              React, TypeScript, MUI & Tailwind
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            {legalLinks.map((item) => (
              <MuiLink
                key={item.label}
                href={item.href}
                underline="hover"
                color="inherit"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  fontSize: "0.92rem",
                }}
              >
                {item.label}
              </MuiLink>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
