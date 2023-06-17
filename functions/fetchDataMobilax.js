
const fetchDataMobilax = async(token, array, mobilax_apis) => {
    const fetchEntireStoreData = await fetchEntireStore(token, mobilax_apis);
    const final_array = [];
    for(const link of array) {
        let object = {
            id_product: link.id_product,
            reference: "",
            quantity: 0,
            wholesale_price: 0,
            ean13: ""

        };

        try {
            let index = fetchEntireStoreData.findIndex((item) => item.url.trim().toLowerCase() == link.url.trim().toLowerCase());
            if(index) {
                final_array.push({...object, 
                    reference: fetchEntireStoreData[index].ean13 ? fetchEntireStoreData[index].ean13.toString() : null,
                    quantity: fetchEntireStoreData[index].quantity,
                    wholesale_price: fetchEntireStoreData[index].price.price,
                    ean13: fetchEntireStoreData[index].ean13 ? fetchEntireStoreData[index].ean13.toString() : null,
                })
            }
        } catch(error) {
            console.log(error)
        }
    }

    return final_array;
}

const fetchEntireStore = async(token, mobilax_apis) => {
    let mobilaxentireproducts = [];

    for(const api of mobilax_apis) {
        const response = await fetch(api.url, {
            headers: {
              Cookie: `token=${token}`,
            },
          });
        const responseJsoned = await response.json();
        mobilaxentireproducts.push(...responseJsoned.products)
    }

    return mobilaxentireproducts
}

module.exports = {
    fetchDataMobilax
}