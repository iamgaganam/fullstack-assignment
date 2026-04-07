import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  Building2,
  Home,
  Menu,
  Sparkles,
  Users,
  X,
} from "lucide-react";

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

function BrandLogo() {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        textDecoration: "none",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 3,
          display: "grid",
          placeItems: "center",
          color: "#fff",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
          boxShadow: `0 12px 26px ${alpha(theme.palette.primary.main, 0.28)}`,
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          ".brand-link:hover &": {
            transform: "translateY(-1px) scale(1.03)",
            boxShadow: `0 16px 32px ${alpha(theme.palette.primary.main, 0.35)}`,
          },
        }}
      >
        <Building2 size={24} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "text.primary",
            whiteSpace: "nowrap",
          }}
        >
          Company Management
        </Typography>
        <Typography
          sx={{
            fontSize: "0.74rem",
            fontWeight: 700,
            color: "text.secondary",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Smart HR Workspace
        </Typography>
      </Box>
    </Stack>
  );
}

function DesktopNavButton({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const theme = useTheme();

  return (
    <Button
      component={RouterLink}
      to={item.path}
      startIcon={item.icon}
      sx={{
        px: 2,
        py: 1.1,
        minHeight: 44,
        borderRadius: 999,
        textTransform: "none",
        fontWeight: 700,
        fontSize: "0.94rem",
        color: active
          ? theme.palette.primary.main
          : theme.palette.text.secondary,
        backgroundColor: active
          ? alpha(theme.palette.primary.main, 0.1)
          : "transparent",
        border: `1px solid ${
          active ? alpha(theme.palette.primary.main, 0.22) : "transparent"
        }`,
        transition: "all 0.25s ease",
        "&:hover": {
          backgroundColor: active
            ? alpha(theme.palette.primary.main, 0.14)
            : alpha(theme.palette.text.primary, 0.05),
          color: theme.palette.text.primary,
        },
      }}
    >
      {item.label}
    </Button>
  );
}

export function Navbar() {
  const location = useLocation();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setElevated(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = useMemo<NavItem[]>(
    () => [
      { path: "/", label: "Home", icon: <Home size={16} /> },
      {
        path: "/departments",
        label: "Departments",
        icon: <Building2 size={16} />,
      },
      { path: "/employees", label: "Employees", icon: <Users size={16} /> },
    ],
    [],
  );

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        color="transparent"
        sx={{
          top: 0,
          backdropFilter: "blur(16px)",
          backgroundColor: elevated
            ? alpha(theme.palette.background.default, 0.78)
            : alpha(theme.palette.background.default, 0.62),
          borderBottom: `1px solid ${
            elevated
              ? alpha(theme.palette.divider, 0.9)
              : alpha(theme.palette.divider, 0.55)
          }`,
          boxShadow: elevated
            ? `0 10px 30px ${alpha(theme.palette.common.black, 0.08)}`
            : "none",
          transition:
            "background-color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 74, md: 82 },
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Brand */}
            <Box
              component={RouterLink}
              to="/"
              className="brand-link"
              sx={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <BrandLogo />
            </Box>

            {/* Desktop Nav */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                display: { xs: "none", md: "flex" },
                p: 0.75,
                borderRadius: 999,
                backgroundColor: alpha(theme.palette.background.paper, 0.72),
                border: `1px solid ${alpha(theme.palette.divider, 0.75)}`,
                backdropFilter: "blur(12px)",
              }}
            >
              {navItems.map((item) => (
                <DesktopNavButton
                  key={item.path}
                  item={item}
                  active={isActive(item.path)}
                />
              ))}
            </Stack>

            {/* Desktop Right */}
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Chip
                icon={<Sparkles size={14} />}
                label="Modern UI"
                sx={{
                  height: 36,
                  borderRadius: 999,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                }}
              />

              <Button
                component={RouterLink}
                to="/employees"
                variant="contained"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  minHeight: 42,
                  px: 2.2,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: `0 10px 22px ${alpha(theme.palette.primary.main, 0.22)}`,
                }}
              >
                Open Employees
              </Button>
            </Stack>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                width: 44,
                height: 44,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                color: "text.primary",
              }}
            >
              <Menu size={22} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 320,
            maxWidth: "88vw",
            backgroundColor: theme.palette.background.default,
            backgroundImage: "none",
            borderLeft: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              px: 2,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              component={RouterLink}
              to="/"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              <BrandLogo />
            </Box>

            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{
                width: 42,
                height: 42,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              }}
            >
              <X size={20} />
            </IconButton>
          </Box>

          <Divider />

          <Box sx={{ px: 2, pt: 2 }}>
            <Chip
              icon={<Sparkles size={14} />}
              label="Navigation"
              sx={{
                borderRadius: 999,
                fontWeight: 700,
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              }}
            />
          </Box>

          <List sx={{ px: 1.5, py: 2 }}>
            {navItems.map((item) => {
              const active = isActive(item.path);

              return (
                <ListItemButton
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    mb: 1,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 3,
                    border: `1px solid ${
                      active
                        ? alpha(theme.palette.primary.main, 0.2)
                        : "transparent"
                    }`,
                    backgroundColor: active
                      ? alpha(theme.palette.primary.main, 0.1)
                      : "transparent",
                    color: active
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    "&:hover": {
                      backgroundColor: active
                        ? alpha(theme.palette.primary.main, 0.14)
                        : alpha(theme.palette.text.primary, 0.05),
                    },
                  }}
                >
                  <Box
                    sx={{
                      mr: 1.5,
                      display: "flex",
                      alignItems: "center",
                      color: "inherit",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 700,
                      fontSize: "0.96rem",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          <Box sx={{ mt: "auto", p: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1.25}>
              <Button
                component={RouterLink}
                to="/departments"
                variant="outlined"
                fullWidth
                startIcon={<Building2 size={16} />}
                sx={{
                  minHeight: 46,
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
                variant="contained"
                fullWidth
                endIcon={<ArrowRight size={16} />}
                sx={{
                  minHeight: 46,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Manage Employees
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
