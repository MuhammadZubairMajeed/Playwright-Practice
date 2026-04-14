import { test, expect } from "@playwright/test";
import { site, adminLogin } from "./bankLogin.spec"

test('Add Account', async ({ page }) => {

    await site(page);
    await adminLogin(page);
    await createAccount(page);
    // await editAccount(page);
    await deleteAccount(page);
});

async function createAccount(page) {

    await expect(page.locator('[id="nav-dashboard"]')).toHaveClass(/bg-gradient-to-r from-purple-600 to-pink-600/);
    await expect(page.locator('[id="add-account-link"]')).toBeVisible();
    await page.locator('[id="add-account-link"]').click();
    await addAccount(page);

}

async function addAccount(page) {

    const modalTitle = page.locator('[id="modal-title"]');
    const titleText = await modalTitle.innerText();  
    console.log("The Modal title is "+titleText);
    if (titleText === "Add New Account") {

        await page.locator('[id="account-name"]').fill('Tester Account');
        await page.locator('[id="account-type"]').click();
        await expect(page.locator('[id="account-type"]')).toHaveAttribute('data-state', 'open');
        const dropdownValues = page.locator('[role="option"]').nth(1);
        await dropdownValues.click();
        await page.locator('[id="initial-balance"]').fill('100');
        await expect(page.locator('[id="status-active"]')).toHaveAttribute('data-state', 'checked');
        await page.getByLabel('Enable Overdraft Protection').check();
        await page.locator('[id="save-account-btn"]').click();
        await expect(page.getByText('Account created successfully!')).toBeVisible();
        await editAccount(page);

    } else {

        const modalTitlenew = page.locator('[id="modal-title"]');
        const titleTextnew = await modalTitlenew.innerText();
        console.log("The Modal title is "+titleTextnew);
        await expect(page.locator('[id="modal-title"]')).toHaveText('Edit Account');
        await page.locator('[id="account-name"]').fill('Tester Account New');
        await page.locator('[id="initial-balance"]').fill('200');
        await page.locator('[id="save-account-btn"]').click();
        await expect(page.getByText('Account updated successfully!')).toBeVisible();

    }
}

async function editAccount(page) {

    await page.locator('[id="nav-accounts"]').click();
    await expect(page.locator('[id="nav-accounts"]')).toHaveClass(/bg-gradient-to-r from-purple-600 to-pink-600/);
    const targetRow = page.locator('table tbody tr').filter({ hasText: 'Tester Account' });
    await targetRow.getByRole('button', { name: 'Edit' }).click();
    await addAccount(page);
}

async function deleteAccount(page) {

    //await page.locator('[id="nav-accounts"]').click();
    await expect(page.locator('[id="nav-accounts"]')).toHaveClass(/bg-gradient-to-r from-purple-600 to-pink-600/);
    const targetRow = page.locator('table tbody tr').filter({ hasText: 'Tester Account' });
    await targetRow.getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator('[id="delete-modal"]')).toHaveText(/Confirm Delete/);
    await page.locator('[id="confirm-delete-btn"]').click();
    
}