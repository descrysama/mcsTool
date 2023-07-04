const bricoPhone = require('./website_scripts/bricoPhone');
const Ebay = require('./website_scripts/ebay');
const ecranTelephone = require('./website_scripts/ecranTelephone');
const laPommeDiscount = require('./website_scripts/laPommeDiscount');
const phoneExpert78 = require('./website_scripts/phoneExpert78');
const pieceTelephone = require('./website_scripts/pieceTelephone');
const ToutPourPhone = require('./website_scripts/toutPourPhone');
const WorldItech = require('./website_scripts/WorldItech');

const classInstances = {
    "www.tout-pour-phone.com": ToutPourPhone,
    "www.brico-phone.com": bricoPhone,
    "www.phonexpert78.com": phoneExpert78,
    "www.world-itech.com": WorldItech,
    "www.lapommediscount.com": laPommeDiscount,
    "ecrans-telephone.com": ecranTelephone,
    "www.piecetelephone.fr": pieceTelephone,
    "www.ebay.fr": Ebay
};

async function getCheapestFromProduct(product) {
    if (product.concurent_urls.length > 0) {
        let lowestPrice = product.price;
        let lowestPriceOfConcurent = null;
        await Promise.all(
            product.concurent_urls.map(async (link, index) => {
                let url = new URL(link.url)
                if (classInstances[url.hostname]) {
                    let price = await classInstances[url.hostname].getData(link.url);
                    let supplier_price = product.wholesale_price
                    if(lowestPriceOfConcurent == null) {
                        lowestPriceOfConcurent = price;
                    } else {
                        if(lowestPriceOfConcurent > price) {
                            lowestPriceOfConcurent = price;
                        }
                    }

                    if (price < lowestPrice) {
                        if (price - 1 >= (supplier_price * 1.16)) {
                            lowestPrice = price - 1;
                        }
                    }

                    if((index + 1) == product.concurent_urls.length) {
                        if(product.price == lowestPrice && lowestPriceOfConcurent >= (supplier_price * 1.16)) {
                            lowestPrice = lowestPriceOfConcurent - 1;
                        }
                    }
                    
                }
            })
        )

        let endPrice = (parseInt(lowestPrice * 1.2) + 0.99)
        return { ...product, price: (endPrice / 1.2) };
    } else {
        let supplier_price = product.wholesale_price         
        if(product.price < (supplier_price * 1.16)) {
            let lowestPrice = supplier_price * 1.16
            let endPrice = (parseInt(lowestPrice * 1.2) + 0.99)

            return { ...product, price: (endPrice / 1.2) };
        } return null
        
    }
}

module.exports = getCheapestFromProduct;
