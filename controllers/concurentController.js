const { Sequelize, DataTypes, Op } = require("sequelize");

const db = require("../models");
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
            limit: limit
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
        const allProducts = await products.findAll({
            attributes: [
                "id_product",
                "ean13",
                "price",
                "wholesale_price",
                "reference",
            ],
            offset: skip,
            limit: limit
        });

        const totalProducts = await mcsProductLang.findOne({
            attributes: [[Sequelize.fn("COUNT", Sequelize.col("*")), "count"]],
            where: {
                name: {
                    [Op.like]: `%${query}%`,
                },
                id_lang: 1
            },
        });

        const findInLangTable = await mcsProductLang.findAll({
            attributes: ["name", "id_product"],
            where: {
                name: {
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

                const concurentLinksArray = await concurentLinks.findAll({
                    where: { id_product: lang.id_product },
                });

                return {
                    reference: originalProduct.reference,
                    ean13: originalProduct.ean13,
                    id_product: lang.id_product,
                    name: lang.name,
                    price: parseFloat(originalProduct.price),
                    concurent_urls: concurentLinksArray,
                    wholesale_price: parseFloat(originalProduct.wholesale_price),
                    image_url: images
                        ? `https://mcs-parts.fr/api/images/products/${lang.id_product}/${images.id_image}?ws_key=${config.mcs_image_key}`
                        : null,
                    quantity: stockAvailable ? stockAvailable.quantity : null
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

async function addConcurentLink(req, res) {
    const { links, id_product } = req.body
    if (!links || !id_product) {
        return res.status(500).json({ error: "Veuillez fournir au moins un lien et un id_product." });
    }

    try {
        const findProduct = await products.findOne({
            where: {
                id_product: id_product
            }
        });

        if (!findProduct) {
            return res.status(500).json({ error: "Ce produit n'existe pas." });
        }

        try {
            await Promise.all(links.map(async (link) => {
                const checkIfAlreadyExists = await concurentLinks.findOne({
                    where: {
                        id_product: id_product,
                        url: link
                    }
                });

                if (!checkIfAlreadyExists) {
                    await concurentLinks.create({ id_product: id_product, url: link });
                }
            }));

            const concurentLinksUpdate = await concurentLinks.findAll({
                where: {
                    id_product: id_product
                }
            });

            return res.json(concurentLinksUpdate);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour des liens concurrents." });
        }


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
}

async function deleteLink(req, res) {
    const link_id = req.params.id;

    if (!link_id) {
        return res.status(500).json({ error: "Veuillez specifier un id." })
    }

    const checkIfExist = await concurentLinks.findByPk(link_id);

    if (!checkIfExist) {
        return res.status(500).json({ error: "Le lien n'existe pas." })
    }

    await concurentLinks
        .destroy({
            where: { id: link_id },
        })
        .then(() => {
            return res.json({message: "Lien supprimé avec succès."});
        });

}

async function compareConcurents(req, res) {

}



module.exports = {
    getAll,
    getByPage,
    search,
    addConcurentLink,
    deleteLink,
    compareConcurents
}