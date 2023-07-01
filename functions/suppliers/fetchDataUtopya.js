const request = require("request");
const cheerio = require("cheerio");

async function fetchDataUtopya(email, password, urlsArray) {
  const loginUrl = "https://www.utopya.fr/mikiito/ajax/loginPost/ajax/1";
  const accountUrl = "https://www.utopya.fr/customer/account/";

  let jar = request.jar();
  let session = request.defaults({ jar: jar });
  let final_array = [];

  session.get(accountUrl, (error, response, body) => {
    const $ = cheerio.load(body);
    const formKey = $('input[name="form_key"]').val();

    const payload = {
      form_key: formKey,
      "login[username]": email,
      "login[password]": password,
      ajax: "true",
    };

    session.post(loginUrl, { form: payload }, async(error, response, body) => {
      const responseJson = JSON.parse(body);

      if (responseJson.state === "ERROR") {
        console.log("Échec de la connexion :", responseJson.message);
      } else {
        console.log("Connecté avec succès !");

        await new Promise((resolve, reject) => {
          urlsArray.forEach(async(link, index) => {
            const result = await get_data(link, session);
            final_array.push(result);
            if(index >= urlsArray.length) {
              resolve()
            }
          });
          
        })
        // Reset the session cookie jar after done
        jar = request.jar();
        session = request.defaults({ jar: jar });
      }
    });
  });
  return final_array;
}

async function get_data(link, session) {
  let object = {
    id_product: link.id_product,
    reference: "",
    quantity: 0,
    wholesale_price: 0,
    ean13: "",
  };

  try {
    const body = await new Promise((resolve, reject) => {
      session.get(link.url, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });

    const $ = cheerio.load(body);

    const eanData = $('strong[data-th="EAN"]').text().trim();
    object = { ...object, ean13: eanData };

    const formDiv = $('div.product-atc');
    let productSku = formDiv.find('form').attr("data-product-sku");
    if (!productSku) {
      productSku = $('li.attr-sku').find('strong.data').text().trim();
    }
    if (productSku) {
      object = { ...object, reference: productSku };
    }
    
    let priceAmountElement = $('meta[itemprop="price"]').attr("content");
    const priceAmount = priceAmountElement ? priceAmountElement.trim() : "0";
    object = { ...object, wholesale_price: parseFloat(priceAmount)};    

    const stockTag = $("p.stock.color-green");
    let stockFinal;
    if (stockTag.length > 0) {
      stockFinal = 99;
    } else {
      stockFinal = 0;
    }
    object = { ...object, quantity: stockFinal };

    return object;
  } catch (error) {
    console.error("Error occurred during session.get:", error);
    // Handle the error as needed
  }

}

module.exports = {
  fetchDataUtopya,
};