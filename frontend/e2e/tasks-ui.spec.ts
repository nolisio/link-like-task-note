import { test, expect } from './fixtures/mockBackend';

const TRIGGER_TEXT = '新しいタスクを追加...';

test.describe('tasksページ UI重なり検証（モバイル）', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page, mockState }) => {
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token);
    }, mockState.token);
    await page.goto('/tasks');
    await expect(page.getByText(TRIGGER_TEXT)).toBeVisible();
  });

  test('TaskInputトリガーがHeaderより下、かつ最初のTaskItemより上に配置される', async ({ page }) => {
    const header = page.locator('header').first();
    const trigger = page.getByText(TRIGGER_TEXT);
    const firstTask = page.getByText('モックタスク1').first();

    await expect(header).toBeVisible();
    await expect(firstTask).toBeVisible();

    const headerBox = await header.boundingBox();
    const triggerBox = await trigger.boundingBox();
    const taskBox = await firstTask.boundingBox();

    expect(headerBox).not.toBeNull();
    expect(triggerBox).not.toBeNull();
    expect(taskBox).not.toBeNull();

    expect(triggerBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
    expect(taskBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 1);
  });

  test('スクロール後もTaskInputトリガー領域が既存タスクと重ならない', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(200);

    const trigger = page.getByText(TRIGGER_TEXT);
    const firstTask = page.getByText('モックタスク1').first();

    const triggerBox = await trigger.boundingBox();
    const taskBox = await firstTask.boundingBox();

    if (triggerBox && taskBox) {
      const overlapsVertically =
        triggerBox.y < taskBox.y + taskBox.height && taskBox.y < triggerBox.y + triggerBox.height;
      expect(overlapsVertically).toBe(false);
    }
  });

  test('モーダル経由で新規タスク追加してもUIが崩れない', async ({ page }) => {
    await page.getByText(TRIGGER_TEXT).click();
    const dialog = page.getByRole('dialog', { name: 'タスクを作成' });
    await expect(dialog).toBeVisible();

    await dialog.locator('input[type="text"]').fill('新規テストタスク');
    await dialog.getByRole('button', { name: '作成' }).click();

    await expect(page.getByText('新規テストタスク')).toBeVisible();

    const trigger = page.getByText(TRIGGER_TEXT);
    const newTask = page.getByText('新規テストタスク').first();

    const triggerBox = await trigger.boundingBox();
    const taskBox = await newTask.boundingBox();

    expect(triggerBox).not.toBeNull();
    expect(taskBox).not.toBeNull();
    expect(taskBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 1);
  });
});

test.describe('tasksページ UI重なり検証（デスクトップ）', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page, mockState }) => {
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token);
    }, mockState.token);
    await page.goto('/tasks');
    await expect(page.getByText(TRIGGER_TEXT)).toBeVisible();
  });

  test('デスクトップビューでTaskInputトリガーと最初のTaskが重ならない', async ({ page }) => {
    const trigger = page.getByText(TRIGGER_TEXT);
    const firstTask = page.getByText('モックタスク1').first();

    const triggerBox = await trigger.boundingBox();
    const taskBox = await firstTask.boundingBox();

    expect(triggerBox).not.toBeNull();
    expect(taskBox).not.toBeNull();
    expect(taskBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 1);
  });
});
