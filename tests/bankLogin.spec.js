import { test, expect } from '@playwright/test';

const BANK_URL = 'https://www.qaplayground.com/bank';

export const site = async ( page ) => {
    await page.goto(BANK_URL);
    //Assertion
    await expect(page.getByText('Welcome to SecureBank')).toBeVisible();
    await page.emulateMedia({ colorScheme: 'dark' });
    
};

async function notLogin(page) {
    if (await page.locator('[id="login-btn"]').isVisible()) {
        await page.locator('[id="login-btn"]').click();
    }
    await expect(page.locator('[id="username-error"]')).toBeVisible();
}

export const adminLogin = async ( page ) => {

    await page.goto(BANK_URL);
    //Assertion
    await expect(page.getByText('Welcome to SecureBank')).toBeVisible();
    await page.locator('[id="username"]').fill("admin");
    await page.locator('[id="password"]').fill("admin123");
    if (await page.locator('[id="login-btn"]').isVisible()) {
        await page.locator('[id="login-btn"]').click();
    }

    //  await logout(page);
};

async function logout(page) {

    page.once('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept();
    });
    await page.getByTestId('logout-button').click();
    await notLogin(page);

}