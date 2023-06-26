const request = require("request");
const cheerio = require("cheerio");

async function fetchDataUtopya(email, password, urlsArray) {
  const loginUrl = "https://www.utopya.fr/mikiito/ajax/loginPost/ajax/1";
  const accountUrl = "https://www.utopya.fr/customer/account/";

  let session = request.defaults({ jar: true });
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

    session.post(loginUrl, { form: payload }, (error, response, body) => {
      const responseJson = JSON.parse(body);

      if (responseJson.state === "ERROR") {
        console.log("Échec de la connexion :", responseJson.message);
      } else {
        console.log("Connecté avec succès !");

        urlsArray.forEach(async (link) => {
          const result = await get_data(link, session);
          final_array.push(result);
        });
        session = null
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
    const productSku = formDiv.find('form').attr("data-product-sku");
    object = { ...object, reference: productSku };

    const priceAmount = $('meta[property="product:price:amount"]').attr("content").trim();
    object = { ...object, wholesale_price: parseFloat(priceAmount)};

    const stockTag = $("p.stock.color-green");
    let stockFinal;
    if (stockTag.length > 0) {
      stockFinal = 99;
    } else {
      stockFinal = 0;
    }

    object = { ...object, quantity: stockFinal };
  } catch (error) {
    console.error("Error occurred during session.get:", error);
    // Handle the error as needed
  }
  return object;
}

module.exports = {
  fetchDataUtopya,
};
