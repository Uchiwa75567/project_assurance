import { test, expect } from '@playwright/test';

test('login page should render', async ({ page }) => {
  await page.goto('/connexion');
  await expect(page.getByText('Se connecter')).toBeVisible();
});
