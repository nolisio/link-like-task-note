export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type FilterType = 'all' | 'active' | 'completed';
export type RecurrenceType = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
export type RecurrenceUnit = 'DAY' | 'WEEK' | 'MONTH';

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
  recurrenceType: RecurrenceType;
  customIntervalValue: number | null;
  customIntervalUnit: RecurrenceUnit | null;
  lastResetAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateInput {
  title: string;
  priority: Priority;
  dueDate?: string | null;
  recurrenceType: RecurrenceType;
  customIntervalValue?: number | null;
  customIntervalUnit?: RecurrenceUnit | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
