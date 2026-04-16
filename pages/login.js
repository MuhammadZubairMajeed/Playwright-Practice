exports.login = class AdminLogin {
    constructor(page) {
        
        this.page = page
        this.username_textbox = page.locator('[id="username"]')
        this.password_textbox = page.locator('[id="password"]')
        this.login_Button = page.locator('[id="login-btn"]')
    }

    async gotoSite(page){
        await this.page.goto('https://www.qaplayground.com/bank')
    }

    async login(username, password){
        await this.username_textbox.fill(username)
        await this.password_textbox.fill(password)
        await this.login_Button.click()
    }
}