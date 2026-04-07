const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const departmentAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/department`);
    if (!response.ok) throw new Error("Failed to fetch departments");
    return response.json();
  },

  async getById(id: number) {
    const response = await fetch(`${API_BASE_URL}/department/${id}`);
    if (!response.ok) throw new Error("Failed to fetch department");
    return response.json();
  },

  async create(data: { departmentCode: string; departmentName: string }) {
    const response = await fetch(`${API_BASE_URL}/department`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create department");
    return response.json();
  },

  async update(
    id: number,
    data: {
      departmentId: number;
      departmentCode: string;
      departmentName: string;
    },
  ) {
    const response = await fetch(`${API_BASE_URL}/department/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update department");
    return response.json();
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/department/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete department");
  },
};

export const employeeAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/employee`);
    if (!response.ok) throw new Error("Failed to fetch employees");
    return response.json();
  },

  async getById(id: number) {
    const response = await fetch(`${API_BASE_URL}/employee/${id}`);
    if (!response.ok) throw new Error("Failed to fetch employee");
    return response.json();
  },

  async getByDepartment(departmentId: number) {
    const response = await fetch(
      `${API_BASE_URL}/employee/department/${departmentId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch employees");
    return response.json();
  },

  async create(data: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    dateOfBirth: string;
    salary: number;
    departmentId: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/employee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create employee");
    return response.json();
  },

  async update(
    id: number,
    data: {
      employeeId: number;
      firstName: string;
      lastName: string;
      emailAddress: string;
      dateOfBirth: string;
      age: number;
      salary: number;
      departmentId: number;
    },
  ) {
    const response = await fetch(`${API_BASE_URL}/employee/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update employee");
    return response.json();
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/employee/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete employee");
  },
};
