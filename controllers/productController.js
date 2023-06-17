
const db = require("../models");
const products = db.products;
const mcs_stock_available = db.stockAvailable;
const utopya_links = db.utopyaLinks;
const mobilax_links = db.mobilaxLinks;
const mobilaxBrandUrls = db.mobilaxBrandUrls;

const { LoginUtopya } = require('../functions/LoginUtopya');
const { LoginMobilax } = require('../functions/LoginMobilax');

const { fetchDataUtopya } = require("../functions/fetchDataUtopya");
const { fetchDataMobilax } = require("../functions/fetchDataMobilax");
const { compareBoth } = require("../functions/compareBoth");

async function getAll(req, res) {

  try {
    const allProducts = await products.findAll({
      attributes: ['id_product', 'ean13', 'price', 'wholesale_price', 'reference']
    });
    const updatedProducts = await Promise.all(
      allProducts.map(async (product) => {
        const stockAvailable = await mcs_stock_available.findOne({
          where: { id_product: product.id_product },
          attributes: ['quantity'],
        });
    
        return {
          ...product.toJSON(),
          quantity: stockAvailable ? stockAvailable.quantity : null,
          margin_percentage: stockAvailable.quantity ? ((product.price - product.wholesale_price) / product.price) * 100 : null,
          margin_value: stockAvailable.quantity ? (product.price - product.wholesale_price) : null
        };
      })
    );
    if (!updatedProducts) {
      return res.status(500).json({error: "Aucun produit trouvés."});
    }

    return res.status(200).json(updatedProducts);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ error: 'Server error' });
    
  }
}

async function get(req, res) {
  if (!Number.isInteger(parseInt(req.params.page))) {
      return res.status(500).json({ error: "Page non valide." })
  }
  const page = parseInt(req.params.page);
  const skip = (page - 1) * 20;
  const limit = 20;

  const login = await Login(true);
  console.log(login)

  try {
    const allProducts = await products.findAll({
      attributes: ['id_product', 'ean13', 'price', 'wholesale_price', 'reference'],
      offset: skip,
      limit: limit,
    });

    const updatedProducts = await Promise.all(
      allProducts.map(async (product) => {
        const stockAvailable = await mcs_stock_available.findOne({
          where: { id_product: product.id_product },
          attributes: ['quantity'],
        });
    
        return {
          ...product.toJSON(),
          quantity: stockAvailable ? stockAvailable.quantity : null,
          margin_percentage: stockAvailable.quantity ? ((product.price - product.wholesale_price) / product.price) * 100 : null,
          margin_value: stockAvailable.quantity ? (product.price - product.wholesale_price) : null
        };
      })
    );
    if (!updatedProducts) {
      return res.status(500).json({error: "Aucun produit trouvés."});
    }

    return res.status(200).json(updatedProducts);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ error: 'Server error' });
    
  }
}

async function compareSupplier(req, res) {
  //Login utopya avec webdriver
  // Login mobilax avec une simple methode POST
  const [utopyaLogged, mobilaxLogged] = await Promise.all([
    await LoginUtopya(true),
    await LoginMobilax()
  ])

  // Recupération des produits stockés (prestashop)
  const mcs_products = await products.findAll({ attributes: ['id_product', 'ean13', 'price', 'wholesale_price', 'reference'] });

  // Liens des différents suppliers à comparer
  const mobilaxLinksData = await mobilax_links.findAll();
  const utopyaLinksData = await utopya_links.findAll();

  // Produits mobilax recupérés par les api.
  const allMobilaxApis = await mobilaxBrandUrls.findAll();

  const [FetchdataofUtopya, fetchDataOfMobilax] = await Promise.all([
    fetchDataUtopya(utopyaLogged, parsedValues(utopyaLinksData)),
    fetchDataMobilax(mobilaxLogged, parsedValues(mobilaxLinksData), parsedValues(allMobilaxApis))
  ]);

  const final_array = compareBoth(fetchDataOfMobilax, FetchdataofUtopya)

  return res.json(final_array)
}
 



const parsedValues = (array) => {
  let parsedArray = [];
  array.forEach(item => parsedArray.push(item.dataValues));

  return parsedArray
}

module.exports = {
  getAll,
  get,
  compareSupplier
};
