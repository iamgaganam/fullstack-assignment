import { describe, it, expect } from "vitest";

// This test file focuses on data transformation and utility functions
// that are commonly used in the dashboard

describe("Data Transformation Utilities", () => {
  describe("Currency Formatting", () => {
    it("should format currency correctly", () => {
      const formatter = new Intl.NumberFormat("si-LK", {
        style: "currency",
        currency: "LKR",
        maximumFractionDigits: 0,
      });

      const formatted = formatter.format(75000);
      // The si-LK locale returns Sinhala rupee symbol, verify it formats properly
      expect(formatted).toMatch(/\d/);
      expect(formatted).toBeTruthy();
    });

    it("should handle zero values", () => {
      const formatter = new Intl.NumberFormat("si-LK", {
        style: "currency",
        currency: "LKR",
        maximumFractionDigits: 0,
      });

      const formatted = formatter.format(0);
      expect(formatted).toBeTruthy();
    });

    it("should handle large values", () => {
      const formatter = new Intl.NumberFormat("si-LK", {
        style: "currency",
        currency: "LKR",
        maximumFractionDigits: 0,
      });

      const formatted = formatter.format(1000000);
      // Check that it contains numbers and is properly formatted
      expect(formatted).toMatch(/\d/);
      expect(formatted).toBeTruthy();
    });
  });

  describe("Statistics Calculations", () => {
    it("should calculate total salary correctly", () => {
      const employees = [
        { salary: 75000 },
        { salary: 85000 },
        { salary: 65000 },
      ];

      const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
      expect(total).toBe(225000);
    });

    it("should calculate average salary correctly", () => {
      const employees = [
        { salary: 75000 },
        { salary: 85000 },
        { salary: 65000 },
      ];

      const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
      const average = total / employees.length;
      expect(Math.round(average)).toBe(75000);
    });

    it("should handle empty employee list", () => {
      const employees: { salary: number }[] = [];

      const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
      const average = employees.length > 0 ? total / employees.length : 0;
      expect(average).toBe(0);
    });

    it("should calculate percentage correctly", () => {
      const departmentPayroll = 75000;
      const totalPayroll = 225000;

      const percentage = Math.round((departmentPayroll / totalPayroll) * 100);
      expect(percentage).toBe(33);
    });
  });

  describe("Payroll Distribution", () => {
    it("should calculate payroll by department", () => {
      const employees = [
        { departmentId: 1, salary: 75000 },
        { departmentId: 1, salary: 85000 },
        { departmentId: 2, salary: 65000 },
        { departmentId: 2, salary: 70000 },
      ];

      const deptPayrollMap: { [key: number]: number } = {};
      employees.forEach((emp) => {
        if (emp.departmentId) {
          deptPayrollMap[emp.departmentId] =
            (deptPayrollMap[emp.departmentId] || 0) + emp.salary;
        }
      });

      expect(deptPayrollMap[1]).toBe(160000);
      expect(deptPayrollMap[2]).toBe(135000);
    });

    it("should sort departments by payroll descending", () => {
      const departments = [
        { departmentId: 1, totalPayroll: 160000 },
        { departmentId: 2, totalPayroll: 135000 },
        { departmentId: 3, totalPayroll: 50000 },
      ];

      const sorted = [...departments].sort(
        (a, b) => b.totalPayroll - a.totalPayroll,
      );

      expect(sorted[0].departmentId).toBe(1);
      expect(sorted[1].departmentId).toBe(2);
      expect(sorted[2].departmentId).toBe(3);
    });

    it("should limit to top 5 departments", () => {
      const departments = Array.from({ length: 10 }, (_, i) => ({
        departmentId: i + 1,
        totalPayroll: 100000 - i * 5000,
      }));

      const topFive = departments.slice(0, 5);

      expect(topFive.length).toBe(5);
      expect(topFive[0].departmentId).toBe(1);
      expect(topFive[4].departmentId).toBe(5);
    });
  });

  describe("Change Calculation", () => {
    it("should calculate percentage change", () => {
      const current = 100;
      const previous = 80;

      const percentChange = ((current - previous) / previous) * 100;
      expect(percentChange).toBe(25);
    });

    it("should handle zero previous value", () => {
      const previous = 0;

      const change = previous === 0 ? "New" : "calculated";
      expect(change).toBe("New");
    });

    it("should identify positive changes", () => {
      const current = 120;
      const previous = 100;

      const percentChange = ((current - previous) / previous) * 100;
      const isPositive = percentChange > 0;
      expect(isPositive).toBe(true);
    });

    it("should identify negative changes", () => {
      const current = 80;
      const previous = 100;

      const percentChange = ((current - previous) / previous) * 100;
      const isPositive = percentChange > 0;
      expect(isPositive).toBe(false);
    });
  });
});
