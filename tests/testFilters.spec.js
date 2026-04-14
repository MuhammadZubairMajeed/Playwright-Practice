import { test, expect } from "@playwright/test";
import { site, adminLogin } from "./bankLogin.spec"

test('Add Account', async ({ page }) => {

    await site(page);
    await adminLogin(page);
    await goToAccount(page);
    await filterByAccountType(page);
});

async function goToAccount(page) {

    await expect(page.locator('[id="nav-dashboard"]')).toHaveClass(/bg-gradient-to-r from-purple-600 to-pink-600/);
    await page.locator('[id="nav-accounts"]').click();
    await expect(page.locator('[id="nav-accounts"]')).toHaveClass(/bg-gradient-to-r from-purple-600 to-pink-600/);
    await page.locator('[id="search-input"]').fill("Primary");
    await expect(page.locator('table tbody tr').filter({ hasText: 'Primary Savings' })).toHaveCount(1);

}

async function filterByAccountType(page) {

    const filters = [
        { index: 1, expectedcount: 1 },
        { index: 2, expectedcount: 1 },
        { index: 3, expectedcount: 0 }
    ];

    for(const filter of filters){

        await page.locator('[id="filter-type"]').click();
        await page.locator('[role="option"]').nth(filter.index).click();

        if(filter.expectedcount === 0){
            await expect(page.locator('table tbody tr')).toHaveText(/No accounts found/);
        }else{
            await expect(page.locator('table tbody tr')).toHaveCount(filter.expectedcount);
        }

    }
}