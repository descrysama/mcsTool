const request = require("request");
const cheerio = require("cheerio");


class ToutPourPhone {

    static getData(url) {

        if(!url) {
            return
        }

        return new Promise((resolve, reject) => {
            request(url, (error, response, htmlContent) => {
                if (error) {
                    reject(error);
                    return;
                }

                const $ = cheerio.load(htmlContent);
                const priceElement = $('span#our_price_display');
                const price = priceElement.text().replace('€', '').replace(',', '.').trim();
                resolve(parseFloat(price*0.8));
            });
        });
    }
}


module.exports = ToutPourPhone;