import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "@/App";
import * as api from "@/api";

// Mock the API module
vi.mock("@/api");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockDepartmentAPI: any = api.departmentAPI;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockEmployeeAPI: any = api.employeeAPI;

describe("App Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockDepartmentAPI.getAll = vi.fn().mockResolvedValue([]);
    mockEmployeeAPI.getAll = vi.fn().mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the app", () => {
    render(<App />);

    // Check that basic layout elements are present
    expect(screen.getByText(/Your workforce/i)).toBeTruthy();
  });

  it("should store theme preference in localStorage", async () => {
    render(<App />);

    // Check that theme is stored
    await waitFor(() => {
      const theme = localStorage.getItem("theme");
      expect(theme === "dark" || theme === "light").toBe(true);
    });
  });

  it("should render dashboard at root path", () => {
    render(<App />);

    // Dashboard specific content
    expect(screen.getByText(/Your workforce/i)).toBeTruthy();
  });

  it("should handle API errors without crashing", () => {
    mockDepartmentAPI.getAll = vi
      .fn()
      .mockRejectedValue(new Error("API Error"));
    mockEmployeeAPI.getAll = vi.fn().mockRejectedValue(new Error("API Error"));

    render(<App />);

    // App should still render
    expect(screen.getByText(/Your workforce/i)).toBeTruthy();
  });
});

describe("Dark Mode Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockDepartmentAPI.getAll = vi.fn().mockResolvedValue([]);
    mockEmployeeAPI.getAll = vi.fn().mockResolvedValue([]);
  });

  it("should persist theme selection across sessions", async () => {
    const { unmount } = render(<App />);

    // Simulate setting theme
    localStorage.setItem("theme", "dark");

    unmount();

    // Re-render and check if theme persists
    render(<App />);
    const theme = localStorage.getItem("theme");
    expect(theme).toBe("dark");
  });
});
