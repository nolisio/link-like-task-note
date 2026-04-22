import { test, expect } from './fixtures/mockBackend';

test.describe('tasksページ UI重なり検証（モバイル）', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page, mockState }) => {
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token);
    }, mockState.token);
    await page.goto('/tasks');
    await expect(page.getByPlaceholder('新しいタスクを入力...')).toBeVisible();
  });

  test('TaskInputがHeaderより下、かつ最初のTaskItemより上に配置される', async ({ page }) => {
    const header = page.locator('header').first();
    const taskInput = page.getByPlaceholder('新しいタスクを入力...');
    const firstTask = page.getByText('モックタスク1').first();

    await expect(header).toBeVisible();
    await expect(firstTask).toBeVisible();

    const headerBox = await header.boundingBox();
    const inputBox = await taskInput.boundingBox();
    const taskBox = await firstTask.boundingBox();

    expect(headerBox, 'header should have bounding box').not.toBeNull();
    expect(inputBox, 'task input should have bounding box').not.toBeNull();
    expect(taskBox, 'first task should have bounding box').not.toBeNull();

    expect(inputBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
    expect(taskBox!.y).toBeGreaterThanOrEqual(inputBox!.y + inputBox!.height - 1);
  });

  test('スクロール後もTaskInput領域が既存タスクと重ならない', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(200);

    const taskInput = page.getByPlaceholder('新しいタスクを入力...');
    const firstTask = page.getByText('モックタスク1').first();

    const inputBox = await taskInput.boundingBox();
    const taskBox = await firstTask.boundingBox();

    if (inputBox && taskBox) {
      const overlapsVertically =
        inputBox.y < taskBox.y + taskBox.height && taskBox.y < inputBox.y + inputBox.height;
      expect(overlapsVertically, 'TaskInputとTaskItemが垂直方向に重なっていないこと').toBe(false);
    }
  });

  test('新規タスク追加時にUIが崩れない', async ({ page }) => {
    await page.getByPlaceholder('新しいタスクを入力...').fill('新規テストタスク');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('新規テストタスク')).toBeVisible();

    const taskInput = page.getByPlaceholder('新しいタスクを入力...');
    const newTask = page.getByText('新規テストタスク').first();

    const inputBox = await taskInput.boundingBox();
    const taskBox = await newTask.boundingBox();

    expect(inputBox).not.toBeNull();
    expect(taskBox).not.toBeNull();
    expect(taskBox!.y).toBeGreaterThanOrEqual(inputBox!.y + inputBox!.height - 1);
  });
});

test.describe('tasksページ UI重なり検証（デスクトップ）', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page, mockState }) => {
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token);
    }, mockState.token);
    await page.goto('/tasks');
    await expect(page.getByPlaceholder('新しいタスクを入力...')).toBeVisible();
  });

  test('デスクトップビューでTaskInputと最初のTaskが重ならない', async ({ page }) => {
    const taskInput = page.getByPlaceholder('新しいタスクを入力...');
    const firstTask = page.getByText('モックタスク1').first();

    const inputBox = await taskInput.boundingBox();
    const taskBox = await firstTask.boundingBox();

    expect(inputBox).not.toBeNull();
    expect(taskBox).not.toBeNull();
    expect(taskBox!.y).toBeGreaterThanOrEqual(inputBox!.y + inputBox!.height - 1);
  });
});
