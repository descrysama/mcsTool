const request = require('request');
const cheerio = require('cheerio');

class bricoPhone {
  static getData(url) {
    return new Promise((resolve, reject) => {
      request(url, (error, response, htmlContent) => {
        if (error) {
          reject(error);
          return;
        }

        const $ = cheerio.load(htmlContent);
        const priceElement = $('span.price_total');
        const price = priceElement.text().replace('€', '').replace(',', '.').trim();
        resolve(parseFloat(price/1.2));
      });
    });
  }
}

module.exports = bricoPhone;
