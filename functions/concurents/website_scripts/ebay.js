const request = require("request");
const cheerio = require("cheerio");


class Ebay {

    static async getData(url) {
        return await new Promise((resolve, reject) => {
            request(url, (error, response, html) => {
                if (!error) {
                    const $ = cheerio.load(html);
                    const priceElement = $('span[itemprop="price"]');
                    const price = priceElement.attr('content');
                    resolve(parseFloat(price/1.2));
                } else {
                    reject(`Error: ${error}`);
                }
            });
        });
    }
}


module.exports = Ebay;