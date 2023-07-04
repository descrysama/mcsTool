const request = require("request");
const cheerio = require("cheerio");


class laPommeDiscount {
    static getData(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $ = cheerio.load(html);
                    const priceElement = $('span#ajaxPriceTTC');
                    const price = priceElement.text().replace('€', '').replace(',', '.').trim();
                    resolve(parseFloat(price/1.2));
                } else {
                    reject(`Error: ${error}`);
                }
            });
        });
    }
}


module.exports = laPommeDiscount;