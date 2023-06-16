const { Builder, By, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');


async function initBrowser(headless) {
  try {
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(headless ? new Options().headless() : null).build();
    return driver;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
    initBrowser
}