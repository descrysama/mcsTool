const request = require("request");
const cheerio = require("cheerio");


class phoneExpert78 {
    static async getData(url) {
        try {
            const response = await new Promise((resolve, reject) => {
                request(url, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
            });

            const $ = cheerio.load(response.body);
            const priceElement = $('span.PBSalesPrice');
            const price = priceElement.text().replace('€', '').replace(',', '.').trim();
            return parseFloat(price/1.2);
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
}


module.exports = phoneExpert78;