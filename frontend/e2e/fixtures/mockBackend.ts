import { test as base, expect, Page, Route } from '@playwright/test';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
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

export const createMockState = (overrides: Partial<MockState> = {}): MockState => ({
  tasks: [
    {
      id: 1,
      title: 'モックタスク1',
      completed: false,
      priority: 'HIGH',
      createdAt: new Date('2026-04-20T10:00:00Z').toISOString(),
      updatedAt: new Date('2026-04-20T10:00:00Z').toISOString(),
    },
    {
      id: 2,
      title: 'モックタスク2',
      completed: true,
      priority: 'LOW',
      createdAt: new Date('2026-04-20T09:00:00Z').toISOString(),
      updatedAt: new Date('2026-04-20T09:00:00Z').toISOString(),
    },
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
      const body = route.request().postDataJSON() as { title: string; priority: Task['priority'] };
      const now = new Date().toISOString();
      const newTask: Task = {
        id: Math.max(0, ...state.tasks.map((t) => t.id)) + 1,
        title: body.title,
        priority: body.priority,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
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
