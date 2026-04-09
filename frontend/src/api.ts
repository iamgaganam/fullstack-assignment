import type { Department, Employee } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ApiErrorResponse = {
  message?: string;
};

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
}

async function readResponseBody<T>(response: Response): Promise<T | undefined> {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return undefined;

  const text = await response.text();
  if (!text.trim()) return undefined;

  return JSON.parse(text) as T;
}

async function request<T>(
  path: string,
  fallbackMessage: string,
  init?: RequestInit,
) {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const data = await readResponseBody<T | ApiErrorResponse>(response);

  if (!response.ok) {
    throw new Error(
      isApiErrorResponse(data) && data.message ? data.message : fallbackMessage,
    );
  }

  return data as T | undefined;
}

async function requestJson<T>(
  path: string,
  fallbackMessage: string,
  init?: RequestInit,
) {
  const data = await request<T>(path, fallbackMessage, init);

  if (typeof data === "undefined") {
    throw new Error("Expected a JSON response from the server");
  }

  return data;
}

async function requestVoid(
  path: string,
  fallbackMessage: string,
  init?: RequestInit,
) {
  await request<void>(path, fallbackMessage, init);
}

export const departmentAPI = {
  async getAll() {
    return requestJson<Department[]>(
      "/department",
      "Failed to fetch departments",
    );
  },

  async getById(id: number) {
    return requestJson<Department>(
      `/department/${id}`,
      "Failed to fetch department",
    );
  },

  async create(data: { departmentCode: string; departmentName: string }) {
    return requestJson<number>("/department", "Failed to create department", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async update(
    id: number,
    data: {
      departmentId: number;
      departmentCode: string;
      departmentName: string;
    },
  ) {
    return requestVoid(`/department/${id}`, "Failed to update department", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    await requestVoid(`/department/${id}`, "Failed to delete department", {
      method: "DELETE",
    });
  },
};

export const employeeAPI = {
  async getAll() {
    return requestJson<Employee[]>("/employee", "Failed to fetch employees");
  },

  async getById(id: number) {
    return requestJson<Employee>(`/employee/${id}`, "Failed to fetch employee");
  },

  async getByDepartment(departmentId: number) {
    return requestJson<Employee[]>(
      `/employee/department/${departmentId}`,
      "Failed to fetch employees",
    );
  },

  async create(data: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    dateOfBirth: string;
    salary: number;
    departmentId: number;
  }) {
    return requestJson<number>("/employee", "Failed to create employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
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
    return requestVoid(`/employee/${id}`, "Failed to update employee", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    await requestVoid(`/employee/${id}`, "Failed to delete employee", {
      method: "DELETE",
    });
  },
};
