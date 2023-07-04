const request = require("request");
const cheerio = require("cheerio");


class pieceTelephone {

    static getData(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $ = cheerio.load(html);
                    const priceElement = $('div.product-price')
                        .find('div.current-price')
                        .find('span[itemprop="price"]');
                    const price = priceElement.attr('content').trim();
                    console.log(parseFloat(price/1.2))
                    resolve(parseFloat(price/1.2));
                } else {
                    reject(`Error: ${error}`);
                }
            });
        });
    }
}


module.exports = pieceTelephone;