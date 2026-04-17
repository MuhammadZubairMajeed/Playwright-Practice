import { test, expect } from "@playwright/test";
import { site, adminLogin } from "./bankLogin.spec";
import { changeTheme } from "./bankLogin.spec";
import { login } from '../pages/login';
import { CREDENTIALS } from '../data/credentials';

test('Add Account', async ({ page }) => {

    const admin_login = new login(page)
    await admin_login.gotoSite()
    await changeTheme(page); //Change theme into Dark mode
    await admin_login.login(CREDENTIALS.admin.user, CREDENTIALS.admin.pass)
    // await site(page);
    // await adminLogin(page);
    await goToAccount(page);
    await filterByAccountType(page);
    await sortFilter(page);
});

async function goToAccount(page) {

    await expect(page.locator('[id="nav-dashboard"]')).toHaveClass(/bg-gradient-to-r from-purple-600 to-pink-600/);
    await page.locator('[id="nav-accounts"]').click();
    await expect(page.locator('[id="nav-accounts"]')).toHaveClass(/bg-gradient-to-r from-purple-600 to-pink-600/);
    await page.locator('[id="search-input"]').fill("Primary");
    await expect(page.locator('table tbody tr').filter({ hasText: 'Primary Savings' })).toHaveCount(1);
    await page.locator('[id="search-input"]').fill("");

}

async function filterByAccountType(page) {

    const filters = [
        { index: 1, expectedcount: 1 },
        { index: 2, expectedcount: 1 },
        { index: 3, expectedcount: 0 },
        { index: 0, expectedcount: 2 }
    ];

    for (const filter of filters) {

        await page.locator('[id="filter-type"]').click();
        await page.locator('[role="option"]').nth(filter.index).click();

        if (filter.expectedcount === 0) {
            await expect(page.locator('table tbody tr')).toHaveText(/No accounts found/);
        } else {
            await expect(page.locator('table tbody tr')).toHaveCount(filter.expectedcount);
        }

    }
}

async function sortFilter(page) {

    await page.locator('[id="sort-by"]').click();
    await page.locator('[role="option"]').nth(1).click();
    let tablerows = await page.locator('table tbody tr').count();
    console.log("Your table contains " + tablerows + " rows");
    const options = 3;
    const values = await page.locator('table tbody tr td:nth-child(4)').allInnerTexts();
    console.log(values);
    const highest = values.map(val => {
        const cleaned = val.replace(/[^0-9.-]+/g, "");
        return parseFloat(cleaned);
    });
    const firstValue = highest[0];
    const highestValue = Math.max(...highest);
    if (highestValue === firstValue) {
        console.log(highestValue);
        await page.locator('[id="reset-filters-btn"]').click();
    }else{
        console.log("The founded values are "+highest);
    }
}