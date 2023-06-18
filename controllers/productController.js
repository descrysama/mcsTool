const { Sequelize, DataTypes } = require('sequelize');
const db = require("../models");
const products = db.products;
const mcs_stock_available = db.stockAvailable;
const utopya_links = db.utopyaLinks;
const mobilax_links = db.mobilaxLinks;
const mobilaxBrandUrls = db.mobilaxBrandUrls;
const mcsImages = db.mcsImages;
const mcsConfig = db.mcsConfig;

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

        const images = await mcsImages.findOne({
          where: { id_product: product.id_product }
        })
    
        return {
          ...product.toJSON(),
          price: parseFloat(product.price),
          wholesale_price: parseFloat(product.wholesale_price),
          image_url: images ? `https://mcs-parts.fr/api/images/products/${product.id_product}/${images.id_image}?ws_key=YLAUHMGVHQRWWQ8M4HLHTUED27DAJ5G7` : null,
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

async function getByPage(req, res) {
  if (!Number.isInteger(parseInt(req.params.page))) {
      return res.status(500).json({ error: "Page non valide." })
  }
  const page = parseInt(req.params.page);
  const skip = (page - 1) * 20;
  const limit = 20;

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
    

        const images = await mcsImages.findOne({
          where: { id_product: product.id_product }
        })

        const config = await mcsConfig.findOne({id: 1});

        return {
          ...product.toJSON(),
          price: parseFloat(product.price),
          wholesale_price: parseFloat(product.wholesale_price),
          image_url: images ? `https://mcs-parts.fr/api/images/products/${product.id_product}/${images.id_image}?ws_key=${config.mcs_image_key}` : null,
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
  const config = await mcsConfig.findOne({id: 1});
  const [utopyaLogged, mobilaxLogged] = await Promise.all([
    await LoginUtopya(true, config.utopya_email, config.utopya_password),
    await LoginMobilax(config.mobilax_email, config.mobilax_password)
  ])

  // Recupération des produits stockés (prestashop)
  // const mcs_products = await products.findAll({ attributes: ['id_product', 'ean13', 'price', 'wholesale_price', 'reference'] });

  // Liens des différents suppliers à comparer + Produits mobilax recupérés par les api
  const [mobilaxLinksData, utopyaLinksData, allMobilaxApis] = await Promise.all([
    await mobilax_links.findAll(),
    await utopya_links.findAll(),
    await mobilaxBrandUrls.findAll()
  ])


  const [FetchdataofUtopya, fetchDataOfMobilax] = await Promise.all([
    fetchDataUtopya(utopyaLogged, parsedValues(utopyaLinksData)),
    fetchDataMobilax(mobilaxLogged, parsedValues(mobilaxLinksData), parsedValues(allMobilaxApis))
  ]);

  const final_array = compareBoth(fetchDataOfMobilax, FetchdataofUtopya)

  for(const item of final_array) {
    await products.update(
      {
        reference: item.reference,
        wholesale_price: item.wholesale_price,
        ean13: item.ean13
      },
      {
        where : {id_product: item.id_product}
      }
    ).then(async() => {
      await mcs_stock_available.update(
        {
          quantity: item.quantity
        },
        {
          where : {id_product: item.id_product}
        }
      )
    })
  }
  return res.json(final_array)
}


async function getAverageMargin(req,res) {
  const average = await products.findOne({
    attributes: [
      [Sequelize.literal('AVG(((price - wholesale_price) / price) * 100)'), 'average_margin']
    ],
    where: {
      wholesale_price: {
        [Sequelize.Op.not]: 0
      }
    }
  }
  )
  
  res.json(average);
}








//external function
const parsedValues = (array) => {
  let parsedArray = [];
  array.forEach(item => parsedArray.push(item.dataValues));

  return parsedArray
}

module.exports = {
  getAll,
  getAverageMargin,
  getByPage,
  compareSupplier
};
