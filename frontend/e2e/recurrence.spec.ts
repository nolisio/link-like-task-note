import { test, expect } from './fixtures/mockBackend';

const TRIGGER_TEXT = '新しいタスクを追加...';

test.describe('繰り返しタスク機能', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page, mockState }) => {
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token);
    }, mockState.token);
    await page.goto('/tasks');
    await expect(page.getByText(TRIGGER_TEXT)).toBeVisible();
  });

  test('毎日タスクを作成すると🔄毎日バッジが表示される', async ({ page }) => {
    await page.getByText(TRIGGER_TEXT).click();
    const dialog = page.getByRole('dialog', { name: 'タスクを作成' });
    await expect(dialog).toBeVisible();

    await dialog.locator('input[type="text"]').first().fill('朝のストレッチ');
    await dialog.getByRole('button', { name: '毎日' }).click();
    await dialog.getByRole('button', { name: '作成' }).click();

    const newTaskRow = page.locator('text=朝のストレッチ').locator('..').locator('..');
    await expect(page.getByText('朝のストレッチ')).toBeVisible();
    await expect(newTaskRow.getByLabel('毎日').first()).toBeVisible();
  });

  test('毎週タスクを作成すると📅毎週バッジが表示される', async ({ page }) => {
    await page.getByText(TRIGGER_TEXT).click();
    const dialog = page.getByRole('dialog', { name: 'タスクを作成' });

    await dialog.locator('input[type="text"]').first().fill('週次レポート');
    await dialog.getByRole('button', { name: '毎週' }).click();
    await dialog.getByRole('button', { name: '作成' }).click();

    await expect(page.getByText('週次レポート')).toBeVisible();
    await expect(page.getByLabel('毎週').first()).toBeVisible();
  });

  test('カスタム繰り返し(3日毎)を作成すると3日毎バッジが表示される', async ({ page }) => {
    await page.getByText(TRIGGER_TEXT).click();
    const dialog = page.getByRole('dialog', { name: 'タスクを作成' });

    await dialog.locator('input[type="text"]').first().fill('換気扇掃除');
    await dialog.getByRole('button', { name: 'カスタム' }).click();

    const intervalInput = dialog.getByLabel('カスタム間隔の数値');
    await expect(intervalInput).toBeVisible();
    await intervalInput.fill('3');
    await dialog.getByLabel('カスタム間隔の単位').selectOption('DAY');

    await dialog.getByRole('button', { name: '作成' }).click();

    await expect(page.getByText('換気扇掃除')).toBeVisible();
    await expect(page.getByLabel('3日毎に繰り返し').first()).toBeVisible();
  });

  test('ONCEタスクには繰り返しバッジが表示されない', async ({ page }) => {
    await page.getByText(TRIGGER_TEXT).click();
    const dialog = page.getByRole('dialog', { name: 'タスクを作成' });

    await dialog.locator('input[type="text"]').first().fill('一回だけのタスク');
    await dialog.getByRole('button', { name: '作成' }).click();

    await expect(page.getByText('一回だけのタスク')).toBeVisible();

    const row = page.getByText('一回だけのタスク').locator('..').locator('..');
    await expect(row.getByLabel('毎日')).toHaveCount(0);
    await expect(row.getByLabel('毎週')).toHaveCount(0);
    await expect(row.getByLabel('毎月')).toHaveCount(0);
  });

  test('モーダルはEscapeで閉じる', async ({ page }) => {
    await page.getByText(TRIGGER_TEXT).click();
    const dialog = page.getByRole('dialog', { name: 'タスクを作成' });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
