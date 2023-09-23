const { hashPassword, comparePassword } = require('../tools/hashPassword');
const jwt = require('jsonwebtoken');
const db = require("../models");
const orders = db.orders;
const products = db.products;
const product_orders = db.product_orders;
const Op = db.Sequelize.Op;


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

module.exports.getAll = async (req, res) => {
    try {
        const ordersList = await orders.findAll({
            where: {
              user_id: res.locals.user.id
            },
            include: [{
              model: product_orders, // Use the correct model here
              as: 'product_orders' // Use the correct alias here
            }]
          });

        
        return res.status(200).json(ordersList);
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports.create = async (req, res) => {
    const { amount, products } = req.body;
    if (isNaN(amount)) {
        return res.json({
            error: "Amount missing."
        })
    }
    try {
        const orderBody = {
            uuid: uuidv4(),
            amount: amount,
            user_id: res.locals.user.id,
            status: false,
            shipping_status: 0,
            country: res.locals.user.country,
            address: res.locals.user.address,
            postal_code: res.locals.user.postal_code
        }
        const order = await orders.create(orderBody);

        products.forEach(async (product) => {
            await product_orders.create({
                order_id: order.id,
                product_id: product.id,
                quantity: product.quantity
            })
        });

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
}

