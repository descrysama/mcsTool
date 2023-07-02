const { Sequelize, DataTypes, Op } = require("sequelize");

const db = require("../../models");
const concurentLinks = db.concurentLinks;
const mcs_stock_available = db.stockAvailable;
const products = db.products;
const mcsImages = db.mcsImages;
const mcsConfig = db.mcsConfig;
const mcsProductLang = db.mcsProductLang;


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

        const concurentLinksArray = await concurentLinks.findAll({
          where: { id_product: product.id_product },
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


        return {
          ...product.toJSON(),
          price: parseFloat(product.price),
          name: name ? name.meta_title : null,
          concurent_urls: concurentLinksArray,
          wholesale_price: parseFloat(product.wholesale_price),
          image_url: images
            ? `https://mcs-parts.fr/api/images/products/${product.id_product}/${images.id_image}?ws_key=${config.mcs_image_key}`
            : null,
          quantity: stockAvailable ? stockAvailable.quantity : null,
        };
      })
    )

    if (!updatedProducts) {
      return { error: "Aucun produit trouvés." };
    }

    return updatedProducts;

  } catch (error) {
    console.error(error);
    return { error: "Server error" };
  }
}

module.exports = {
  getAll
}