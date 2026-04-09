import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Mock fetch BEFORE importing API
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { departmentAPI, employeeAPI } from "@/api";

describe("API Module", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  describe("Department API", () => {
    it("should fetch all departments", async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([["content-type", "application/json"]]),
        text: async () => JSON.stringify(mockDepartments),
      });

      const result = await departmentAPI.getAll();

      expect(result).toEqual(mockDepartments);
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should fetch department by ID", async () => {
      const mockDepartment = {
        departmentId: 1,
        departmentCode: "ENG",
        departmentName: "Engineering",
        createdDate: "2024-01-01",
        modifiedDate: "2024-01-01",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([["content-type", "application/json"]]),
        text: async () => JSON.stringify(mockDepartment),
      });

      const result = await departmentAPI.getById(1);

      expect(result).toEqual(mockDepartment);
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should create a new department", async () => {
      const newDepartment = {
        departmentCode: "HR",
        departmentName: "Human Resources",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([["content-type", "application/json"]]),
        text: async () => JSON.stringify(3),
      });

      const result = await departmentAPI.create(newDepartment);

      expect(result).toBe(3);
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should handle API errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Map([["content-type", "application/json"]]),
        text: async () => JSON.stringify({ message: "Server error" }),
      });

      await expect(departmentAPI.getAll()).rejects.toThrow("Server error");
    });
  });

  describe("Employee API", () => {
    it("should fetch all employees", async () => {
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
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([["content-type", "application/json"]]),
        text: async () => JSON.stringify(mockEmployees),
      });

      const result = await employeeAPI.getAll();

      expect(result).toEqual(mockEmployees);
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should fetch employee by ID", async () => {
      const mockEmployee = {
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
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([["content-type", "application/json"]]),
        text: async () => JSON.stringify(mockEmployee),
      });

      const result = await employeeAPI.getById(1);

      expect(result).toEqual(mockEmployee);
    });

    it("should fetch employees by department", async () => {
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
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([["content-type", "application/json"]]),
        text: async () => JSON.stringify(mockEmployees),
      });

      const result = await employeeAPI.getByDepartment(1);

      expect(result).toEqual(mockEmployees);
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should create a new employee", async () => {
      const newEmployee = {
        firstName: "Jane",
        lastName: "Smith",
        emailAddress: "jane@example.com",
        dateOfBirth: "1992-05-15",
        salary: 80000,
        departmentId: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([["content-type", "application/json"]]),
        text: async () => JSON.stringify(2),
      });

      const result = await employeeAPI.create(newEmployee);

      expect(result).toBe(2);
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
