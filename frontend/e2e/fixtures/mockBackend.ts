import { test as base, expect, Page, Route } from '@playwright/test';

type RecurrenceType = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
type RecurrenceUnit = 'DAY' | 'WEEK' | 'MONTH';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string | null;
  recurrenceType: RecurrenceType;
  customIntervalValue: number | null;
  customIntervalUnit: RecurrenceUnit | null;
  lastResetAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};

export type MockState = {
  tasks: Task[];
  user: User;
  token: string;
};

const defaultTask = (overrides: Partial<Task>): Task => ({
  id: 0,
  title: '',
  completed: false,
  priority: 'MEDIUM',
  dueDate: null,
  recurrenceType: 'ONCE',
  customIntervalValue: null,
  customIntervalUnit: null,
  lastResetAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockState = (overrides: Partial<MockState> = {}): MockState => ({
  tasks: [
    defaultTask({
      id: 1,
      title: 'モックタスク1',
      priority: 'HIGH',
      createdAt: new Date('2026-04-20T10:00:00Z').toISOString(),
      updatedAt: new Date('2026-04-20T10:00:00Z').toISOString(),
    }),
    defaultTask({
      id: 2,
      title: 'モックタスク2',
      completed: true,
      priority: 'LOW',
      createdAt: new Date('2026-04-20T09:00:00Z').toISOString(),
      updatedAt: new Date('2026-04-20T09:00:00Z').toISOString(),
    }),
  ],
  user: { id: 1, username: 'testuser', email: 'test@example.com' },
  token: 'mock-jwt-token-for-testing',
  ...overrides,
});

const API_BASE = 'http://localhost:8080/api';

export async function mockBackend(page: Page, state: MockState): Promise<void> {
  await page.route((url) => url.href.startsWith(API_BASE), async (route: Route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace('/api', '');
    const method = route.request().method();

    if (path === '/auth/login' && method === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: state.token, user: state.user }),
      });
      return;
    }

    if (path === '/auth/register' && method === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: state.token, user: state.user }),
      });
      return;
    }

    if (path === '/auth/me' && method === 'GET') {
      const auth = route.request().headers()['authorization'];
      if (auth === `Bearer ${state.token}`) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(state.user),
        });
        return;
      }
      await route.fulfill({ status: 401, body: 'Unauthorized' });
      return;
    }

    if (path === '/tasks' && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(state.tasks),
      });
      return;
    }

    if (path === '/tasks' && method === 'POST') {
      const body = route.request().postDataJSON() as {
        title: string;
        priority: Task['priority'];
        recurrenceType?: RecurrenceType;
        customIntervalValue?: number | null;
        customIntervalUnit?: RecurrenceUnit | null;
      };
      const now = new Date().toISOString();
      const recurrenceType = body.recurrenceType ?? 'ONCE';
      const newTask: Task = defaultTask({
        id: Math.max(0, ...state.tasks.map((t) => t.id)) + 1,
        title: body.title,
        priority: body.priority,
        completed: false,
        recurrenceType,
        customIntervalValue: recurrenceType === 'CUSTOM' ? (body.customIntervalValue ?? null) : null,
        customIntervalUnit: recurrenceType === 'CUSTOM' ? (body.customIntervalUnit ?? null) : null,
        lastResetAt: recurrenceType === 'ONCE' ? null : now,
        createdAt: now,
        updatedAt: now,
      });
      state.tasks.unshift(newTask);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(newTask),
      });
      return;
    }

    const taskIdMatch = path.match(/^\/tasks\/(\d+)$/);
    if (taskIdMatch && method === 'PUT') {
      const id = Number(taskIdMatch[1]);
      const body = route.request().postDataJSON() as Partial<Task>;
      const idx = state.tasks.findIndex((t) => t.id === id);
      if (idx >= 0) {
        state.tasks[idx] = { ...state.tasks[idx], ...body, updatedAt: new Date().toISOString() };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(state.tasks[idx]),
        });
        return;
      }
    }

    if (taskIdMatch && method === 'DELETE') {
      const id = Number(taskIdMatch[1]);
      state.tasks = state.tasks.filter((t) => t.id !== id);
      await route.fulfill({ status: 204, body: '' });
      return;
    }

    await route.fulfill({ status: 404, body: 'Not Found' });
  });
}

export const test = base.extend<{ mockState: MockState }>({
  mockState: [
    async ({ page }, use) => {
      const state = createMockState();
      await mockBackend(page, state);
      await use(state);
    },
    { auto: true },
  ],
});

export { expect };
