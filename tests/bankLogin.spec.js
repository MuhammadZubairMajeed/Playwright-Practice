import { test, expect } from '@playwright/test';
import { login } from '../pages/login';
import { CREDENTIALS } from '../data/credentials';

test('adminLogin', async ({ page }) => {

    const admin_login = new login(page)
    await admin_login.gotoSite()
    await changeTheme(page); //Change theme into Dark mode

    await admin_login.login(CREDENTIALS.admin.user, CREDENTIALS.admin.pass)

    //  await logout(page);
});

export async function changeTheme(page) {
    await page.emulateMedia({ colorScheme: 'dark' });
    //Assertion
    await expect(page.getByText('Welcome to SecureBank')).toBeVisible();
};

async function notLogin(page) {
    if (await page.locator('[id="login-btn"]').isVisible()) {
        await page.locator('[id="login-btn"]').click();
    }
    await expect(page.locator('[id="username-error"]')).toBeVisible();
}

async function logout(page) {

    page.once('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept();
    });
    await page.getByTestId('logout-button').click();
    await notLogin(page);

}