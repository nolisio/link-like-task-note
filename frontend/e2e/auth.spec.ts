import { test, expect } from './fixtures/mockBackend';

test.describe('ログインフロー（ロールバック回帰防止）', () => {
  test('ログイン成功後 /tasks に遷移し、そのまま留まる', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByPlaceholder('メールアドレスを入力')).toBeVisible();

    await page.getByPlaceholder('メールアドレスを入力').fill('test@example.com');
    await page.getByPlaceholder('パスワードを入力').fill('password123');
    await page.getByRole('button', { name: 'ログイン' }).click();

    await expect(page).toHaveURL(/\/tasks$/, { timeout: 5000 });

    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/tasks$/);

    await expect(page.getByText('新しいタスクを追加...')).toBeVisible();
  });

  test('トークン保持状態で /tasks に直接アクセスできる', async ({ page, mockState }) => {
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token);
    }, mockState.token);

    await page.goto('/tasks');

    await expect(page).toHaveURL(/\/tasks$/);
    await expect(page.getByText('新しいタスクを追加...')).toBeVisible({ timeout: 5000 });
  });

  test('未認証で /tasks にアクセスすると /login にリダイレクト', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/login$/, { timeout: 5000 });
  });
});
