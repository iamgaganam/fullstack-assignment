import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { alpha, keyframes, useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  UserPlus2,
  Workflow,
  Zap,
} from "lucide-react";

/* ──────────────────────────────────────────────
   Hooks
────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let frame = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.floor(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);

  return value;
}

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ──────────────────────────────────────────────
   Animations
────────────────────────────────────────────── */
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatY = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.18);
  }
  50% {
    box-shadow: 0 0 0 14px rgba(124, 58, 237, 0.04);
  }
`;

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

/* ──────────────────────────────────────────────
   Small Components
────────────────────────────────────────────── */
function MetricCard({
  label,
  value,
  suffix,
  delay = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
}) {
  const theme = useTheme();
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const count = useCountUp(value, 1600, inView);

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
            : `linear-gradient(180deg, #ffffff 0%, ${alpha(
                theme.palette.primary.light,
                0.05,
              )} 100%)`,
        backdropFilter: "blur(12px)",
        animation: `${fadeUp} 0.7s ease both`,
        animationDelay: `${delay}ms`,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "1.75rem", md: "2rem" },
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: theme.palette.text.primary,
          mb: 0.75,
        }}
      >
        {count}
        {suffix || ""}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontSize: "0.72rem",
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
    </Paper>
  );
}

function GradientIcon({
  icon,
  color = "primary.main",
}: {
  icon: React.ReactNode;
  color?: string;
}) {
  const theme = useTheme();

  return (
    <Avatar
      variant="rounded"
      sx={{
        width: 52,
        height: 52,
        borderRadius: 3.5,
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        color,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
      }}
    >
      {icon}
    </Avatar>
  );
}

function SectionLabel({ text }: { text: string }) {
  const theme = useTheme();

  return (
    <Typography
      sx={{
        mb: 1.5,
        color: theme.palette.primary.main,
        fontSize: "0.76rem",
        fontWeight: 800,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
      }}
    >
      {text}
    </Typography>
  );
}

/* ──────────────────────────────────────────────
   Main Page
────────────────────────────────────────────── */
export function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const modules = [
    {
      title: "Departments",
      icon: <Building2 size={24} />,
      route: "/departments",
      accent: theme.palette.info.main,
      description:
        "Create and manage your entire organisational structure with a clean command centre built for clarity and control.",
      points: [
        "Fast department setup",
        "Code-based identification",
        "Organised structural management",
        "Safe and maintainable workflows",
      ],
      buttonText: "Open Departments",
    },
    {
      title: "Employees",
      icon: <Users size={24} />,
      route: "/employees",
      accent: theme.palette.primary.main,
      description:
        "Keep employee records, assignments, and core people operations in one modern workspace with better visibility.",
      points: [
        "Central employee records",
        "Smart form validation",
        "Role and department linking",
        "Scalable people management",
      ],
      buttonText: "Open Employees",
    },
  ];

  const pillars = [
    {
      icon: <Zap size={20} />,
      title: "Fast Experience",
      body: "A responsive interface with fast navigation, compact layouts, and actions that feel immediate.",
    },
    {
      icon: <Shield size={20} />,
      title: "Reliable Data Flow",
      body: "Designed to support safer form handling, better validation, and more predictable user actions.",
    },
    {
      icon: <BarChart3 size={20} />,
      title: "Structured Visibility",
      body: "Clear cards, grouped sections, and meaningful hierarchy help users understand the system faster.",
    },
    {
      icon: <TrendingUp size={20} />,
      title: "Ready to Scale",
      body: "The UI is built to grow with more features, more records, and more workflows without feeling messy.",
    },
  ];

  const capabilities = [
    "Professional dashboard-style landing layout",
    "MUI cards, buttons, chips, papers, and responsive sections",
    "Cleaner spacing and stronger typography hierarchy",
    "Better visual grouping for modules and key actions",
    "Reusable section structure for future expansion",
    "Responsive design that still feels premium on mobile",
  ];

  const quickSteps = [
    {
      icon: <Building2 size={18} />,
      title: "Set up departments",
      body: "Define the structure of your organisation first.",
    },
    {
      icon: <UserPlus2 size={18} />,
      title: "Add employees",
      body: "Create people records and connect them to teams.",
    },
    {
      icon: <Workflow size={18} />,
      title: "Run operations",
      body: "Use one connected flow to manage your HR workspace.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(
                theme.palette.primary.dark,
                0.08,
              )} 100%)`
            : `linear-gradient(180deg, #f8fafc 0%, #ffffff 35%, ${alpha(
                theme.palette.primary.light,
                0.08,
              )} 100%)`,
      }}
    >
      {/* Decorative background */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            radial-gradient(${alpha(theme.palette.primary.main, 0.08)} 1px, transparent 1px),
            radial-gradient(${alpha(theme.palette.info.main, 0.06)} 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px, 42px 42px",
          backgroundPosition: "0 0, 14px 14px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.35), transparent)",
          opacity: 0.8,
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: 680,
          height: 420,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.22,
          )} 0%, ${alpha(theme.palette.info.light, 0.12)} 35%, transparent 72%)`,
          filter: "blur(18px)",
          pointerEvents: "none",
        }}
      />

      {/* HERO */}
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 10 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.15fr 0.85fr" },
            gap: { xs: 6, md: 8 },
            alignItems: "center",
          }}
        >
          {/* Left */}
          <Box>
            <Chip
              icon={<Sparkles size={14} />}
              label="Premium HR Workspace"
              sx={{
                mb: 3,
                px: 1,
                height: 34,
                borderRadius: 999,
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
                animation: heroVisible ? `${fadeUp} 0.65s ease both` : "none",
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.4rem" },
                lineHeight: 1.02,
                letterSpacing: "-0.05em",
                fontWeight: 900,
                color: theme.palette.text.primary,
                maxWidth: 820,
                animation: heroVisible ? `${fadeUp} 0.75s ease both` : "none",
                animationDelay: "70ms",
              }}
            >
              Manage your people
              <br />
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                with a polished modern UI.
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 2.5,
                maxWidth: 660,
                color: theme.palette.text.secondary,
                fontSize: { xs: "1rem", md: "1.08rem" },
                lineHeight: 1.8,
                animation: heroVisible ? `${fadeUp} 0.8s ease both` : "none",
                animationDelay: "150ms",
              }}
            >
              A better home screen for your HR system with stronger hierarchy,
              cleaner spacing, premium cards, modern CTA sections, and an
              overall dashboard feel that looks much more production-ready.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                mt: 4,
                animation: heroVisible ? `${fadeUp} 0.85s ease both` : "none",
                animationDelay: "230ms",
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowRight size={16} />}
                onClick={() => navigate("/departments")}
                sx={{
                  minHeight: 52,
                  px: 3.2,
                  borderRadius: 3,
                  fontWeight: 700,
                  boxShadow: `0 12px 24px ${alpha(
                    theme.palette.primary.main,
                    0.24,
                  )}`,
                  textTransform: "none",
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/employees")}
                sx={{
                  minHeight: 52,
                  px: 3.2,
                  borderRadius: 3,
                  fontWeight: 700,
                  textTransform: "none",
                  borderColor: alpha(theme.palette.divider, 0.9),
                  bgcolor: alpha(theme.palette.background.paper, 0.65),
                  backdropFilter: "blur(8px)",
                }}
              >
                View Employees
              </Button>
            </Stack>

            <Box
              sx={{
                mt: 5,
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2,
                animation: heroVisible ? `${fadeUp} 0.95s ease both` : "none",
                animationDelay: "320ms",
              }}
            >
              <MetricCard
                label="Departments"
                value={100}
                suffix="+"
                delay={420}
              />
              <MetricCard
                label="Employees"
                value={1000}
                suffix="+"
                delay={520}
              />
              <MetricCard label="Uptime" value={99} suffix=".9%" delay={620} />
              <MetricCard
                label="Operations"
                value={10}
                suffix="k+"
                delay={720}
              />
            </Box>
          </Box>

          {/* Right visual dashboard */}
          <Box
            sx={{
              position: "relative",
              animation: heroVisible ? `${fadeUp} 0.9s ease both` : "none",
              animationDelay: "200ms",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                p: { xs: 2, md: 2.5 },
                borderRadius: 6,
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                background:
                  theme.palette.mode === "dark"
                    ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.98)} 100%)`
                    : `linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)`,
                backdropFilter: "blur(16px)",
                boxShadow: `0 30px 80px ${alpha(theme.palette.common.black, 0.12)}`,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(110deg, transparent 25%, ${alpha(
                    theme.palette.common.white,
                    theme.palette.mode === "dark" ? 0.02 : 0.35,
                  )} 50%, transparent 75%)`,
                  backgroundSize: "200% 100%",
                  animation: `${shimmer} 7s linear infinite`,
                  pointerEvents: "none",
                }}
              />

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {[
                  theme.palette.error.main,
                  theme.palette.warning.main,
                  theme.palette.success.main,
                ].map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: color,
                    }}
                  />
                ))}
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 0.9fr",
                  gap: 2,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                    bgcolor: alpha(theme.palette.background.paper, 0.75),
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                  >
                    <Typography fontWeight={800}>
                      Organisation Overview
                    </Typography>
                    <Chip
                      size="small"
                      label="Live"
                      sx={{
                        fontWeight: 700,
                        bgcolor: alpha(theme.palette.success.main, 0.12),
                        color: theme.palette.success.dark,
                        animation: `${pulseGlow} 2.2s ease-in-out infinite`,
                      }}
                    />
                  </Stack>

                  <Stack spacing={1.5}>
                    {[
                      {
                        name: "Operations",
                        width: "92%",
                        color: theme.palette.primary.main,
                      },
                      {
                        name: "Finance",
                        width: "74%",
                        color: theme.palette.info.main,
                      },
                      {
                        name: "HR",
                        width: "81%",
                        color: theme.palette.success.main,
                      },
                      {
                        name: "Admin",
                        width: "66%",
                        color: theme.palette.warning.main,
                      },
                    ].map((item) => (
                      <Box key={item.name}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ mb: 0.7 }}
                        >
                          <Typography variant="body2" fontWeight={700}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.width}
                          </Typography>
                        </Stack>
                        <Box
                          sx={{
                            height: 10,
                            borderRadius: 999,
                            bgcolor: alpha(theme.palette.text.primary, 0.08),
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: item.width,
                              height: "100%",
                              borderRadius: 999,
                              bgcolor: item.color,
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                <Stack spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                      bgcolor: alpha(theme.palette.background.paper, 0.75),
                    }}
                  >
                    <Typography fontWeight={800} sx={{ mb: 1.5 }}>
                      Quick Metrics
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {[
                        { label: "Teams", value: "12" },
                        { label: "Users", value: "184" },
                        { label: "Tasks", value: "24" },
                      ].map((item) => (
                        <Box
                          key={item.label}
                          sx={{
                            flex: 1,
                            p: 1.2,
                            borderRadius: 3,
                            textAlign: "center",
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                          }}
                        >
                          <Typography fontWeight={800}>{item.value}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.label}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                      bgcolor: alpha(theme.palette.background.paper, 0.75),
                    }}
                  >
                    <Typography fontWeight={800} sx={{ mb: 1.5 }}>
                      Recent Activity
                    </Typography>

                    <Stack spacing={1.25}>
                      {[
                        "New department created",
                        "Employee record updated",
                        "Assignment linked to team",
                      ].map((text, index) => (
                        <Stack
                          key={text}
                          direction="row"
                          spacing={1.2}
                          alignItems="center"
                          sx={{
                            p: 1.1,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.text.primary, 0.03),
                            animation: `${floatY} ${4 + index}s ease-in-out infinite`,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              bgcolor: alpha(theme.palette.primary.main, 0.12),
                              color: theme.palette.primary.main,
                            }}
                          >
                            <CheckCircle2 size={16} />
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            {text}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Paper>
                </Stack>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                bottom: -24,
                left: -28,
                p: 2,
                width: 210,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                bgcolor: alpha(theme.palette.background.paper, 0.88),
                backdropFilter: "blur(10px)",
                boxShadow: `0 18px 36px ${alpha(theme.palette.common.black, 0.12)}`,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 42,
                    height: 42,
                    bgcolor: alpha(theme.palette.success.main, 0.15),
                    color: theme.palette.success.main,
                  }}
                >
                  <TrendingUp size={18} />
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={800}>
                    Productivity Up
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cleaner workflows, faster actions
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* MODULES */}
      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, py: { xs: 7, md: 10 } }}
      >
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <SectionLabel text="Core Modules" />
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.6rem" },
              fontWeight: 900,
              letterSpacing: "-0.03em",
              mb: 1.5,
            }}
          >
            Two key entry points, redesigned properly
          </Typography>
          <Typography
            sx={{
              maxWidth: 700,
              mx: "auto",
              color: theme.palette.text.secondary,
              lineHeight: 1.8,
            }}
          >
            Your home page now feels like a real product landing experience
            instead of a basic navigation screen.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 3,
          }}
        >
          {modules.map((module) => (
            <Card
              key={module.title}
              elevation={0}
              sx={{
                borderRadius: 5,
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                overflow: "hidden",
                background:
                  theme.palette.mode === "dark"
                    ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.92)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
                    : `linear-gradient(180deg, #ffffff 0%, ${alpha(module.accent, 0.04)} 100%)`,
                transition:
                  "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: `0 22px 48px ${alpha(module.accent, 0.18)}`,
                  borderColor: alpha(module.accent, 0.3),
                },
              }}
            >
              <Box
                sx={{
                  height: 6,
                  background: `linear-gradient(90deg, ${module.accent}, ${alpha(module.accent, 0.55)})`,
                }}
              />

              <CardContent sx={{ p: { xs: 2.5, md: 3.2 } }}>
                <GradientIcon icon={module.icon} color={module.accent} />

                <Typography
                  sx={{
                    mt: 2.2,
                    mb: 1,
                    fontSize: "1.45rem",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {module.title}
                </Typography>

                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.75,
                    mb: 3,
                  }}
                >
                  {module.description}
                </Typography>

                <Stack spacing={1.15} sx={{ mb: 3 }}>
                  {module.points.map((point) => (
                    <Stack
                      key={point}
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: module.accent,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {point}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<ChevronRight size={17} />}
                  onClick={() => navigate(module.route)}
                  sx={{
                    minHeight: 50,
                    borderRadius: 3,
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: module.accent,
                    "&:hover": {
                      bgcolor: module.accent,
                      filter: "brightness(0.95)",
                    },
                  }}
                >
                  {module.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* PILLARS */}
      <Box
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          bgcolor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === "dark" ? 0.04 : 0.03,
          ),
          py: { xs: 7, md: 9 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <SectionLabel text="Why This UI Is Better" />
            <Typography
              sx={{
                fontSize: { xs: "1.95rem", md: "2.4rem" },
                fontWeight: 900,
                letterSpacing: "-0.03em",
                mb: 1.5,
              }}
            >
              Built with stronger visual foundations
            </Typography>
            <Typography
              sx={{
                maxWidth: 680,
                mx: "auto",
                color: theme.palette.text.secondary,
                lineHeight: 1.8,
              }}
            >
              The layout is now more balanced, the interactions are clearer, and
              the sections feel intentional instead of randomly stacked.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {pillars.map((pillar) => (
              <Paper
                key={pillar.title}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  background: alpha(theme.palette.background.paper, 0.75),
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: alpha(theme.palette.primary.main, 0.28),
                  },
                }}
              >
                <GradientIcon icon={pillar.icon} />
                <Typography
                  sx={{ mt: 2, mb: 1, fontWeight: 800, fontSize: "1.04rem" }}
                >
                  {pillar.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, lineHeight: 1.75 }}
                >
                  {pillar.body}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CAPABILITIES / WORKFLOW */}
      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, py: { xs: 7, md: 10 } }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 4, md: 5 },
            alignItems: "start",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 5,
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              background:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.88)
                  : "#ffffff",
            }}
          >
            <SectionLabel text="Capabilities" />
            <Typography
              sx={{
                fontSize: { xs: "1.9rem", md: "2.25rem" },
                fontWeight: 900,
                letterSpacing: "-0.03em",
                mb: 1.5,
              }}
            >
              Designed for real admin workflows
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              This layout gives your product a better first impression and makes
              navigation feel much more intentional and product-grade.
            </Typography>

            <Stack spacing={1.3}>
              {capabilities.map((item, index) => (
                <Stack
                  key={item}
                  direction="row"
                  spacing={1.3}
                  alignItems="flex-start"
                  sx={{
                    py: 1.2,
                    borderBottom:
                      index !== capabilities.length - 1
                        ? `1px solid ${alpha(theme.palette.divider, 0.7)}`
                        : "none",
                  }}
                >
                  <CheckCircle2
                    size={18}
                    color={theme.palette.primary.main}
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                    }}
                  >
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Button
              variant="contained"
              endIcon={<ArrowRight size={16} />}
              onClick={() => navigate("/departments")}
              sx={{
                mt: 3,
                minHeight: 48,
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Start with Departments
            </Button>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 5,
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              background:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.88)
                  : "#ffffff",
            }}
          >
            <SectionLabel text="Quick Workflow" />
            <Typography
              sx={{
                fontSize: { xs: "1.9rem", md: "2.25rem" },
                fontWeight: 900,
                letterSpacing: "-0.03em",
                mb: 1.5,
              }}
            >
              A better journey from the first click
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              Users immediately understand where to go and what to do next,
              which is exactly what a strong home page should do.
            </Typography>

            <Stack spacing={2}>
              {quickSteps.map((step, index) => (
                <Paper
                  key={step.title}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.divider, 0.75)}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.035),
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                      }}
                    >
                      {index + 1}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            color: theme.palette.primary.main,
                            display: "flex",
                          }}
                        >
                          {step.icon}
                        </Box>
                        <Typography fontWeight={800}>{step.title}</Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          mt: 0.75,
                          lineHeight: 1.7,
                        }}
                      >
                        {step.body}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: alpha(theme.palette.info.main, 0.12),
                  color: theme.palette.info.main,
                }}
              >
                <Clock3 size={20} />
              </Avatar>
              <Box>
                <Typography fontWeight={800}>
                  Optimised for first impressions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users should understand your product within seconds.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Container>

      {/* CTA */}
      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, pb: { xs: 8, md: 10 } }}
      >
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, md: 5 },
            borderRadius: 6,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
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
              top: -60,
              right: -40,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(
                theme.palette.primary.main,
                0.18,
              )} 0%, transparent 68%)`,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <SectionLabel text="Ready to Use" />
            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "2.7rem" },
                fontWeight: 900,
                letterSpacing: "-0.04em",
                maxWidth: 760,
                mx: "auto",
                mb: 1.5,
              }}
            >
              Your home page now looks like a real product entry screen
            </Typography>

            <Typography
              sx={{
                maxWidth: 620,
                mx: "auto",
                color: theme.palette.text.secondary,
                lineHeight: 1.8,
                mb: 3.5,
              }}
            >
              It is cleaner, more premium, more balanced, and much easier to
              build on as your app grows.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Building2 size={17} />}
                onClick={() => navigate("/departments")}
                sx={{
                  minHeight: 52,
                  px: 3.2,
                  borderRadius: 3,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Manage Departments
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Users size={17} />}
                onClick={() => navigate("/employees")}
                sx={{
                  minHeight: 52,
                  px: 3.2,
                  borderRadius: 3,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                }}
              >
                Manage Employees
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
