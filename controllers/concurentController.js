const { Sequelize, DataTypes, Op } = require("sequelize");
const getAllProducts = require('../functions/concurents/getAllProducts');

const db = require("../models");
const getCheapestFromProduct = require("../functions/concurents/compareConcurents");
const concurentLinks = db.concurentLinks;
const mcs_stock_available = db.stockAvailable;
const products = db.products;
const products_shop = db.products_shop;
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

async function getSingle(req, res) {

    if (!req.params.id) {
        return res.status(500).json({ error: "Veuillez specifier un id" })
    }

    try {
        const product = await products.findOne({
            where: {
                id_product: req.params.id
            },
            attributes: [
                "id_product",
                "ean13",
                "price",
                "wholesale_price",
                "reference",
            ],
        });

        if (!product) {
            return res.status(500).json({ error: "Produit non trouvé." })
        }
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


        return res.status(200).json({
            ...product.toJSON(),
            price: parseFloat(product.price),
            name: name ? name.meta_title : null,
            concurent_urls: concurentLinksArray,
            wholesale_price: parseFloat(product.wholesale_price),
            image_url: images
                ? `https://mcs-parts.fr/api/images/products/${product.id_product}/${images.id_image}?ws_key=${config.mcs_image_key}`
                : null,
            quantity: stockAvailable ? stockAvailable.quantity : null,
        });


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
                await concurentLinks.create({ id_product: id_product, url: link });
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
            return res.json({ message: "Lien supprimé avec succès." });
        });

}

async function updateSingleProduct(req, res) {
    const { concurent_urls } = req.body;

    if (!concurent_urls) {
        return res.status(500).json({ error: "Veuillez ajouter des liens." })
    }

    try {
        concurent_urls.map(async (link, index) => {
            let checkIfExists = await concurentLinks.findByPk(link.id);
            if (checkIfExists) {
                await concurentLinks.update(
                    {
                        url: link.url
                    },
                    {
                        where: {
                            id: link.id
                        }
                    }
                );
            } else {
                let checkIfExists = await concurentLinks.findOne({
                    where: {
                        url: link.url
                    }
                })

                if (!checkIfExists) {
                    await concurentLinks.create({ url: link.url, id_product: link.id_product });
                }
            }
        })

        return res.status(200).json({ message: "Liens mis a jour." })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'enregistrement." });
    }

}

async function compareConcurents(req, res) {
    const allProducts = await getAllProducts.getAll();
    const final_array = [];
    await Promise.all(
        allProducts.map(async (product, index) => {
            let result = await getCheapestFromProduct(product);

            if (result) {
                products_shop.update(
                    {
                        price: result.price
                    },
                    {
                        where: {
                            id_product: result.id_product
                        }
                    }
                ).then(async() => {
                    await products.update(
                        {
                            price: result.price
                        },
                        {
                            where: {
                                id_product: result.id_product
                            }
                        }
                    )
                })

                final_array.push(result);
            }
        })
    );
    return res.json(final_array)
}



module.exports = {
    getAll,
    getByPage,
    search,
    addConcurentLink,
    deleteLink,
    compareConcurents,
    getSingle,
    updateSingleProduct
}