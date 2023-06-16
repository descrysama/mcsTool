const { Builder, By, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/firefox');
const webdriver = require('selenium-webdriver');

async function waitForElement(driver, selector, timeout) {
  await driver.wait(until.elementLocated(By.css(selector)), timeout);
  await driver.wait(until.elementIsVisible(driver.findElement(By.css(selector))), timeout);
}

async function Login(headless) {
  try {
    const options = new Options();
    
    // Enable headless mode
    if (headless) {
      options.headless();
    }
    
    // Set user agent
    options.setPreference('general.useragent.override', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

    const driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();

    await driver.get('https://www.utopya.fr/customer/account/login/');
    const div = await driver.findElement(By.id('footer'));
    const hiddenDivs = await div.findElements(By.xpath(".//div[@style='display: none']"));
    await driver.executeScript("arguments[0].style.display = 'block';", hiddenDivs[1]);

    const emailInput = await driver.findElement(By.name('login[username]'));
    await emailInput.sendKeys('louis.lantiez@outlook.com');

    const passwordInput = await driver.findElement(By.name('login[password]'));
    await passwordInput.sendKeys('Google59');

    const form = await driver.findElement(By.id('form-popup-login'));
    await form.findElement(By.id('send2')).click();

    await waitForElement(driver, '.account-sidebar', 10000);

    return driver;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  Login
}
