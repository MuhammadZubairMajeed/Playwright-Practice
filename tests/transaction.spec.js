import { test, expect } from "@playwright/test";
import { site, adminLogin } from "./bankLogin.spec";
import { changeTheme } from "./bankLogin.spec";
import { login } from '../pages/login';
import { CREDENTIALS } from '../data/credentials';

test('Add Transaction', async ({ page }) => {

    const admin_login = new login(page)
    await admin_login.gotoSite()
    await changeTheme(page); //Change theme into Dark mode
    await admin_login.login(CREDENTIALS.admin.user, CREDENTIALS.admin.pass)
    await addtransaction(page);
    await submitEmpty(page);
});

async function addtransaction(page) {

    //Assertion to check the user must be on dashboard
    await expect(page.locator('[id="nav-dashboard"]')).toHaveClass(/bg-gradient-to-r from-purple-600 to-pink-600/);
    await page.locator('[id="new-transaction-link"]').click();
    const modalTitle = page.locator('[id="modal-title"]');
    const titleText = await modalTitle.innerText();
    console.log("The Modal title is " + titleText);
    if (titleText === "New Transaction") {

        await page.locator('[id="transaction-type"]').click();
        await expect(page.locator('[id="transaction-type"]')).toHaveAttribute('data-state', 'open');
        let dropdownValues = page.locator('[role="option"]').nth(0);
        await dropdownValues.click();
        await page.locator('[id="from-account"]').click();
        await expect(page.locator('[id="from-account"]')).toHaveAttribute('data-state', 'open');
        dropdownValues = page.locator('[role="option"]').nth(0);
        await dropdownValues.click();
        await page.locator('[id="transaction-amount"]').fill('100');
        await page.locator('[id="transaction-description"]').fill('This is 1st test transaction description');
        await page.locator('[id="submit-transaction-btn"]').click();
        await expect(page.getByText('Transaction completed successfully!')).toBeVisible();
        await balanceAfter(page);
    } else {
        console.log("I am in else statement")
    }
}

async function balanceAfter(page) {

    const rowdesc = await page.locator('table tbody tr:first-child td:nth-child(7)').innerText();
    if (rowdesc === 'This is 1st test transaction description') {
        const balanceValue = await page.locator('table tbody tr:first-child td:nth-child(6)').innerText();
        console.log(balanceValue);
        let cleaned = balanceValue.replace(/[^0-9.-]+/g, "");
        cleaned = parseFloat(cleaned);
        console.log('The First Balance After value is ' + cleaned);
    }else{
        console.log('I am in else statement');
    }
}

async function submitEmpty(page) {

    await page.locator('[id="nav-dashboard"]').click();
    //Assertion to check the user must be on dashboard
    await expect(page.locator('[id="nav-dashboard"]')).toHaveClass(/bg-gradient-to-r from-purple-600 to-pink-600/);
    await page.locator('[id="new-transaction-link"]').click();
    const modalTitle = page.locator('[id="modal-title"]');
    const titleText = await modalTitle.innerText();
    console.log("The Modal title is " + titleText);
    if (titleText === "New Transaction") {

        await expect(page.locator('[id="submit-transaction-btn"]')).toBeVisible();
        await page.locator('[id="submit-transaction-btn"]').click();
        await expect(page.getByRole("alert").filter({ hasText: 'Please select transaction type' })).toBeVisible();
    }
    
}