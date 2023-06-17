const webdriver = require('selenium-webdriver');
const { By, until } = webdriver;

const fetchDataUtopya = async(driver, array) => {
    final_array = [];

    for (const link of array) {
        let object = {
            id_product: link.id_product,
            reference: "",
            quantity: 0,
            wholesale_price: 0,
            ean13: ""

        };
        await driver.get(link.url);
        try {
            

            const skuLi = await driver.wait(until.elementLocated(By.css('li.attr-sku')), 2000);
            const skuElement = await skuLi.findElement(By.tagName('strong'));
            const sku = await skuElement.getText();
            object = {...object, reference: sku.trim()};

            const eanLi = await driver.wait(until.elementLocated(By.css('li.attr-ean')), 2000);
            const eanElement = await eanLi.findElement(By.tagName('strong'));
            const ean = await eanElement.getText();
            object = {...object, ean13: ean.trim()};

            const priceElement = await driver.wait(until.elementLocated(By.css('.price-box .price')), 2000);
            const priceText = await priceElement.getText();
            const wholesale_price = parseFloat(priceText.replace('€', '.'));
            object = { ...object, wholesale_price };

            try {
                const addToCartButton = await driver.wait(until.elementLocated(By.css('button.action.primary.tocart[title="Ajouter au panier"]')),2000);
                object = { ...object, quantity: 99 };
            } catch(error) {
                console.log(error)
                object = { ...object, quantity: 0 };
            }

        } catch {
            console.log('error')
        }

        let findIndex = final_array.findIndex((item) => item.id_product == object.id_product);
        if(findIndex > -1) {
            if(object.wholesale_price < final_array[findIndex].wholesale_price) {
                final_array.splice(findIndex, 1, object)
            }

        } else {
            final_array.push(object);
        }
        
    }
    return final_array;
}

module.exports = {
    fetchDataUtopya
}