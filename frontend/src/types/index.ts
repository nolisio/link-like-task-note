export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type FilterType = 'all' | 'active' | 'completed';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
