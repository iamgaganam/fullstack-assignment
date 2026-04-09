import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import * as api from "@/api";

// Mock the API module
vi.mock("@/api");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockDepartmentAPI: any = api.departmentAPI;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockEmployeeAPI: any = api.employeeAPI;

const mockDepartments = [
  {
    departmentId: 1,
    departmentCode: "ENG",
    departmentName: "Engineering",
    createdDate: "2024-01-01",
    modifiedDate: "2024-01-01",
  },
  {
    departmentId: 2,
    departmentCode: "SALES",
    departmentName: "Sales",
    createdDate: "2024-01-01",
    modifiedDate: "2024-01-01",
  },
];

const mockEmployees = [
  {
    employeeId: 1,
    firstName: "John",
    lastName: "Doe",
    emailAddress: "john@example.com",
    dateOfBirth: "1990-01-01",
    age: 34,
    salary: 75000,
    departmentId: 1,
    createdDate: "2024-01-01",
    modifiedDate: "2024-01-01",
  },
  {
    employeeId: 2,
    firstName: "Jane",
    lastName: "Smith",
    emailAddress: "jane@example.com",
    dateOfBirth: "1992-05-15",
    age: 32,
    salary: 85000,
    departmentId: 2,
    createdDate: "2024-01-01",
    modifiedDate: "2024-01-01",
  },
];

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard isDark={false} />
      </BrowserRouter>,
    );
  };

  it("should render dashboard with page content", () => {
    mockDepartmentAPI.getAll = vi.fn().mockResolvedValue([]);
    mockEmployeeAPI.getAll = vi.fn().mockResolvedValue([]);

    renderDashboard();

    // Should render the page title
    expect(screen.getByText(/Your workforce/i)).toBeTruthy();
  });

  it("should load and display statistics when data is fetched", async () => {
    mockDepartmentAPI.getAll = vi.fn().mockResolvedValue(mockDepartments);
    mockEmployeeAPI.getAll = vi.fn().mockResolvedValue(mockEmployees);

    renderDashboard();

    await waitFor(() => {
      expect(mockDepartmentAPI.getAll).toHaveBeenCalled();
      expect(mockEmployeeAPI.getAll).toHaveBeenCalled();
    });
  });

  it("should display navigation links", () => {
    mockDepartmentAPI.getAll = vi.fn().mockResolvedValue([]);
    mockEmployeeAPI.getAll = vi.fn().mockResolvedValue([]);

    renderDashboard();

    expect(screen.getByText(/Manage employees/i)).toBeTruthy();
    expect(screen.getByText(/View departments/i)).toBeTruthy();
  });

  it("should display recent activity section", () => {
    mockDepartmentAPI.getAll = vi.fn().mockResolvedValue([]);
    mockEmployeeAPI.getAll = vi.fn().mockResolvedValue([]);

    renderDashboard();

    expect(screen.getByText(/Recent activity/i)).toBeTruthy();
  });

  it("should display quick action cards", () => {
    mockDepartmentAPI.getAll = vi.fn().mockResolvedValue([]);
    mockEmployeeAPI.getAll = vi.fn().mockResolvedValue([]);

    renderDashboard();

    expect(screen.getByText(/Jump into your workspace/i)).toBeTruthy();
    expect(screen.getByText(/Department management/i)).toBeTruthy();
  });

  it("should handle API errors gracefully", async () => {
    mockDepartmentAPI.getAll = vi
      .fn()
      .mockRejectedValue(new Error("Failed to fetch departments"));
    mockEmployeeAPI.getAll = vi
      .fn()
      .mockRejectedValue(new Error("Failed to fetch employees"));

    renderDashboard();

    // Component should still render without crashing
    expect(screen.getByText(/Your workforce/i)).toBeTruthy();
  });
});
