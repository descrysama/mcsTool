const { Sequelize, DataTypes, Op } = require("sequelize");
const db = require("../models");
const products = db.products;
const mcs_stock_available = db.stockAvailable;
const utopya_links = db.utopyaLinks;
const mobilax_links = db.mobilaxLinks;
const mobilaxBrandUrls = db.mobilaxBrandUrls;
const mcsImages = db.mcsImages;
const mcsConfig = db.mcsConfig;
const mcsProductLang = db.mcsProductLang;

const { LoginMobilax } = require("../functions/LoginMobilax");
const { fetchDataUtopya } = require("../functions/fetchDataUtopya");
const { fetchDataMobilax } = require("../functions/fetchDataMobilax");
const { compareBoth } = require("../functions/compareBoth");

async function getAll(req, res) {
  try {
    const allProducts = await products.findAll({
      attributes: [
        "id_product",
        "ean13",
        "price",
        "wholesale_price",
        "reference",
      ],
    });
    const updatedProducts = await Promise.all(
      allProducts.map(async (product) => {
        const stockAvailable = await mcs_stock_available.findOne({
          where: { id_product: product.id_product },
          attributes: ["quantity"],
        });

        const images = await mcsImages.findOne({
          where: { id_product: product.id_product },
        });

        const name = await mcsProductLang.findOne({
          where: { id_product: product.id_product, id_lang: 1 },
        });

        const config = await mcsConfig.findOne({
          where: { id: 1 },
        });

        const utopya_urls = await utopya_links.findAll({
          where: { id_product: product.id_product },
        });

        const mobilax_urls = await mobilax_links.findAll({
          where: { id_product: product.id_product },
        });

        return {
          ...product.toJSON(),
          price: parseFloat(product.price),
          name: name ? name.meta_title : null,
          utopya_urls: utopya_urls,
          mobilax_urls: mobilax_urls,
          wholesale_price: parseFloat(product.wholesale_price),
          image_url: images
            ? `https://mcs-parts.fr/api/images/products/${product.id_product}/${images.id_image}?ws_key=${config.mcs_image_key}`
            : null,
          quantity: stockAvailable ? stockAvailable.quantity : null,
          margin_percentage: stockAvailable.quantity
            ? ((product.price - product.wholesale_price) / product.price) * 100
            : null,
          margin_value: stockAvailable.quantity
            ? product.price - product.wholesale_price
            : null,
        };
      })
    );
    if (!updatedProducts) {
      return res.status(500).json({ error: "Aucun produit trouvés." });
    }

    return res.status(200).json(updatedProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

async function getByPage(req, res) {
  if (!Number.isInteger(parseInt(req.params.page))) {
    return res.status(500).json({ error: "Page non valide." });
  }
  const page = parseInt(req.params.page);
  const skip = (page - 1) * 20;
  const limit = 20;

  try {
    const allProducts = await products.findAll({
      attributes: [
        "id_product",
        "ean13",
        "price",
        "wholesale_price",
        "reference",
      ],
      offset: skip,
      limit: limit,
    });

    const totalProducts = await products.findOne({
      attributes: [[Sequelize.fn("COUNT", Sequelize.col("*")), "count"]],
    });

    const updatedProducts = await Promise.all(
      allProducts.map(async (product) => {
        const stockAvailable = await mcs_stock_available.findOne({
          where: { id_product: product.id_product },
          attributes: ["quantity"],
        });

        const images = await mcsImages.findOne({
          where: { id_product: product.id_product },
        });

        const name = await mcsProductLang.findOne({
          where: { id_product: product.id_product, id_lang: 1 },
        });

        const config = await mcsConfig.findOne({
          where: { id: 1 },
        });

        const utopya_urls = await utopya_links.findAll({
          where: { id_product: product.id_product },
        });

        const mobilax_urls = await mobilax_links.findAll({
          where: { id_product: product.id_product },
        });

        return {
          ...product.toJSON(),
          price: parseFloat(product.price),
          name: name ? (name.meta_title ? name.meta_title : name.name) : null,
          utopya_urls: utopya_urls,
          mobilax_urls: mobilax_urls,
          wholesale_price: parseFloat(product.wholesale_price),
          image_url: images
            ? `https://mcs-parts.fr/api/images/products/${product.id_product}/${images.id_image}?ws_key=${config.mcs_image_key}`
            : null,
          quantity: stockAvailable ? stockAvailable.quantity : null,
          margin_percentage: stockAvailable.quantity
            ? ((product.price - product.wholesale_price) / product.price) * 100
            : null,
          margin_value: stockAvailable.quantity
            ? product.price - product.wholesale_price
            : null,
        };
      })
    );
    if (!updatedProducts) {
      return res.status(500).json({ error: "Aucun produit trouvés." });
    }

    return res.status(200).json({
      total_products: totalProducts.dataValues.count,
      products: updatedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

async function search(req, res) {
  if (!Number.isInteger(parseInt(req.params.page))) {
    return res.status(500).json({ error: "Page non valide." });
  }

  const { query } = req.body;

  const page = parseInt(req.params.page);
  const skip = (page - 1) * 20;
  const limit = 20;

  try {

    const totalProducts = await mcsProductLang.findOne({
      attributes: [[Sequelize.fn("COUNT", Sequelize.col("*")), "count"]],
      where: {
        meta_title: {
          [Op.like]: `%${query}%`,
        },
        id_lang: 1
      },
    });

    const findInLangTable = await mcsProductLang.findAll({
      attributes: ["meta_title", "id_product"],
      where: {
        meta_title: {
          [Op.like]: `%${query}%`,
        },
        id_lang: 1
      },
      offset: skip,
      limit: limit,
    });

    const updatedProducts = await Promise.all(
      findInLangTable.map(async (lang) => {

        const originalProduct = await products.findOne({
          attributes: [
            "id_product",
            "ean13",
            "price",
            "wholesale_price",
            "reference",
          ],
          where: { id_product: lang.id_product },
        });

        const stockAvailable = await mcs_stock_available.findOne({
          where: { id_product: lang.id_product },
          attributes: ["quantity"],
        });

        const images = await mcsImages.findOne({
          where: { id_product: lang.id_product },
        });

        const config = await mcsConfig.findOne({
          where: { id: 1 },
        });

        const utopya_urls = await utopya_links.findAll({
          where: { id_product: lang.id_product },
        });

        const mobilax_urls = await mobilax_links.findAll({
          where: { id_product: lang.id_product },
        });

        return {
          reference: originalProduct.reference,
          ean13: originalProduct.ean13,
          id_product: lang.id_product,
          name : lang.meta_title,
          price: parseFloat(originalProduct.price),
          // name: name ? name.meta_title : null,
          utopya_urls: utopya_urls,
          mobilax_urls: mobilax_urls,
          wholesale_price: parseFloat(originalProduct.wholesale_price),
          image_url: images
            ? `https://mcs-parts.fr/api/images/products/${lang.id_product}/${images.id_image}?ws_key=${config.mcs_image_key}`
            : null,
          quantity: stockAvailable ? stockAvailable.quantity : null,
          margin_percentage: stockAvailable.quantity
            ? ((originalProduct.price - originalProduct.wholesale_price) / originalProduct.price) * 100
            : null,
          margin_value: stockAvailable.quantity
            ? originalProduct.price - originalProduct.wholesale_price
            : null,
        };
      })
    );

    if (totalProducts.dataValues.count == 0) {
      return res.status(500).json({ error: "Aucun produit trouvés." });
    }

    return res.status(200).json({
      total_products: totalProducts.dataValues.count,
      products: updatedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

async function compareSupplier(req, res) {
  // Login mobilax avec une simple methode POST
  const config = await mcsConfig.findOne({
    where: { id: 1 }
  });

  const mobilaxLogged =  await LoginMobilax(config.mobilax_email, config.mobilax_password)

  // Recupération des produits stockés (prestashop)
  // const mcs_products = await products.findAll({ attributes: ['id_product', 'ean13', 'price', 'wholesale_price', 'reference'] });

  // Liens des différents suppliers à comparer + Produits mobilax recupérés par les api
  const [mobilaxLinksData, utopyaLinksData, allMobilaxApis] = await Promise.all(
    [
      await mobilax_links.findAll(),
      await utopya_links.findAll(),
      await mobilaxBrandUrls.findAll(),
    ]
  );

  const [FetchdataofUtopya, fetchDataOfMobilax] = await Promise.all([
    fetchDataUtopya(config.utopya_email, config.utopya_password, parsedValues(utopyaLinksData)),
    fetchDataMobilax(
      mobilaxLogged,
      parsedValues(mobilaxLinksData),
      parsedValues(allMobilaxApis)
    ),
  ]);

  const final_array = compareBoth(fetchDataOfMobilax, FetchdataofUtopya);

  for (const item of final_array) {
    await products
      .update(
        {
          reference: item.reference,
          wholesale_price: item.wholesale_price,
          ean13: item.ean13,
        },
        {
          where: { id_product: item.id_product },
        }
      )
      .then(async () => {
        await mcs_stock_available.update(
          {
            quantity: item.quantity,
          },
          {
            where: { id_product: item.id_product },
          }
        );
      });
  }
  return res.json(final_array);
}

async function getAverageMargin(req, res) {
  const average = await products.findOne({
    attributes: [
      [
        Sequelize.literal("AVG(((price - wholesale_price) / price) * 100)"),
        "average_margin",
      ],
    ],
    where: {
      wholesale_price: {
        [Sequelize.Op.not]: 0,
      },
    },
  });

  res.json(average);
}

async function addLinkToProduct(req, res) {
  const { utopya_url, mobilax_url, id_product } = req.body;
  if ((!utopya_url && !mobilax_url) || !id_product) {
    return res.json({
      error: "veuillez fournir au minimum un lien fournisseur.",
    });
  }

  let newUtopyaLink;

  if (utopya_url) {
    try {
      newUtopyaLink = await utopya_links.create({
        id_product: id_product,
        url: utopya_url,
      });
    } catch(e) {
      console.log(e)
    }
  }

  let newMobilaxLink;
  let parseUrl;
  try {
    if(mobilax_url) {
      parseUrl = new URL(mobilax_url.trim())
    }
  } catch(e) {
    console.log(e)
  }

  if (mobilax_url) {
    try {
      newMobilaxLink = await mobilax_links.create({
        id_product: id_product,
        url: parseUrl.pathname.slice(1, parseUrl.pathname.length),
      });
    } catch(e) {
      console.log(e)
    }
  }

  return res.json({ mobilax: newMobilaxLink, utopya: newUtopyaLink });
}

async function deleteLink(req, res) {
  const { utopya, mobilax, id } = req.body;

  if (!mobilax && !utopya) {
    return res.json({ error: "Aucun lien supprimé. Verifiez votre action." });
  }

  if (utopya) {
    const deleteLink = await utopya_links
      .destroy({
        where: { id: id },
      })
      .then((result) => {
        return res.json(result);
      });
  }

  if (mobilax) {
    const deleteLink = await mobilax_links
      .destroy({
        where: { id: id },
      })
      .then((result) => {
        return res.json(result);
      });
  }
}

//external function
const parsedValues = (array) => {
  let parsedArray = [];
  array.forEach((item) => parsedArray.push(item.dataValues));

  return parsedArray;
};

module.exports = {
  getAll,
  search,
  deleteLink,
  getAverageMargin,
  getByPage,
  compareSupplier,
  addLinkToProduct,
};
