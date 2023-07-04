const request = require("request");
const cheerio = require("cheerio");


class ecranTelephone {

    static getData(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $ = cheerio.load(html);
                    const priceElement = $('span#pretaxe_price_display');
                    const price = parseFloat(priceElement.attr('content').trim());
                    resolve(price);
                } else {
                    reject(`Error: ${error}`);
                }
            });
        });
    }
}


module.exports = ecranTelephone;