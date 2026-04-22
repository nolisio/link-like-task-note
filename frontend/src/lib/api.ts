import { AuthResponse, Task, User, Priority } from '../types';

const API_URL = 'http://localhost:8080/api';

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      console.warn('[api] 401 Unauthorized from', res.url);
    }
    throw new UnauthorizedError();
  }

  if (!res.ok) {
    const error = await res.text().catch(() => 'An error occurred');
    throw new Error(error || res.statusText);
  }

  if (res.status === 204) return;
  return res.json();
};

export const api = {
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(res);
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createTask(title: string, priority: Priority = 'MEDIUM', dueDate?: string | null): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, priority, dueDate }),
    });
    return handleResponse(res);
  },

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async deleteTask(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
