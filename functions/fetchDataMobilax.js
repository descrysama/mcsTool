
const fetchDataMobilax = async(token, array, mobilax_apis) => {
    const fetchEntireStoreData = fetchEntireStore(token, mobilax_apis);
    const final_array = [];
    for(const link of array) {
        let object = {
            id_product: link.id_product,
            reference: "",
            quantity: 0,
            price: 0,
            ean13: ""

        };
    }

    return fetchEntireStoreData;
}

const fetchEntireStore = async(token, mobilax_apis) => {
    const mobilaxentireproducts = [];

    for(const api of mobilax_apis) {
        const response = await fetch(api.url, {
            headers: {
              Cookie: `token=${token}`,
            },
          });
        const responseJsoned = await response.json();
        mobilaxentireproducts.push(responseJsoned.products)
    }

    return mobilaxentireproducts
}

module.exports = {
    fetchDataMobilax
}