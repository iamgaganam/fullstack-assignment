/**
 * Shared type definitions
 */

export type Department = {
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  createdDate: string;
  modifiedDate: string;
};

export type Employee = {
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
};

export type DepartmentFormData = {
  departmentCode: string;
  departmentName: string;
};

export type EmployeeFormData = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: string;
  salary: number;
  departmentId: number;
};

export type PageProps = {
  isDark: boolean;
};

export type Stats = {
  totalEmployees: number;
  totalDepartments: number;
  averageSalary: number;
  totalSalary: number;
};

export type DepartmentPayroll = {
  departmentId: number;
  departmentName: string;
  totalPayroll: number;
  percentage: number;
  color: string;
};
