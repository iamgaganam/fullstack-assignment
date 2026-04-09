import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
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

  it("should render the app", async () => {
    render(<App />);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockDepartmentAPI.getAll).toHaveBeenCalled();
    });

    // Check that basic layout elements are present
    expect(screen.getByText(/Your workforce/i)).toBeTruthy();
  });

  it("should store theme preference in localStorage", async () => {
    render(<App />);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockDepartmentAPI.getAll).toHaveBeenCalled();
    });

    // Check that theme is stored
    const theme = localStorage.getItem("theme");
    expect(theme === "dark" || theme === "light").toBe(true);
  });

  it("should render dashboard at root path", async () => {
    render(<App />);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockDepartmentAPI.getAll).toHaveBeenCalled();
    });

    // Dashboard specific content
    expect(screen.getByText(/Your workforce/i)).toBeTruthy();
  });

  it("should handle API errors without crashing", async () => {
    mockDepartmentAPI.getAll = vi
      .fn()
      .mockRejectedValue(new Error("API Error"));
    mockEmployeeAPI.getAll = vi.fn().mockRejectedValue(new Error("API Error"));

    render(<App />);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockDepartmentAPI.getAll).toHaveBeenCalled();
    });

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

    // Wait for component to mount
    await waitFor(() => {
      expect(mockDepartmentAPI.getAll).toHaveBeenCalled();
    });

    // Simulate setting theme
    await act(async () => {
      localStorage.setItem("theme", "dark");
    });

    unmount();

    // Clear mocks for fresh state
    vi.clearAllMocks();
    mockDepartmentAPI.getAll = vi.fn().mockResolvedValue([]);
    mockEmployeeAPI.getAll = vi.fn().mockResolvedValue([]);

    // Re-render and check if theme persists
    render(<App />);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockDepartmentAPI.getAll).toHaveBeenCalled();
    });

    const theme = localStorage.getItem("theme");
    expect(theme).toBe("dark");
  });
});
