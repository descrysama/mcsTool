const bricoPhone = require('./website_scripts/bricoPhone');
const ToutPourPhone = require('./website_scripts/toutPourPhone');

const classInstances = {
    "www.tout-pour-phone.com": ToutPourPhone,
    "www.brico-phone.com": bricoPhone
};

async function getCheapestFromProduct(product) {
    if (product.concurent_urls.length > 0) {
        let lowestPrice = product.price;
        await Promise.all(
            product.concurent_urls.map(async (link, index) => {
                let url = new URL(link.url)
                if (classInstances[url.hostname]) {
                    let price = await classInstances[url.hostname].getData(link.url);
                    let supplier_price = product.wholesale_price
                    if (price < lowestPrice) {
                        if (price >= (supplier_price * 1.16)) {
                            lowestPrice = price;
                        }
                    }
                    if(product.price < (supplier_price * 1.16)) {
                        lowestPrice = (supplier_price * 1.16)
                    }
                } return null
            })
        )

        let endPrice = (parseInt(lowestPrice * 1.2) + 0.99)

        return { ...product, price: (endPrice / 1.2) };
    } else {
        return null
    }
}

module.exports = getCheapestFromProduct;
