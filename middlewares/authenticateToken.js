require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require("../models");
const customers = db.customers;

module.exports.authToken = (req, res, next) => {
    const token = req.cookies._auth || null;

    if (token) {
        if (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
            next()
        } else {
            res.json({
                error: 'Accès refusé. Connectez vous.'
            })
        }
    } else {
        res.status(500).json({ error: 'Accès refusé. Connectez vous.' })
    }
}

module.exports.checkAuth = (req, res, next) => {
    const token = req.cookies._17JJLRaqFTVZzYL || null;

    if (token) {
        if (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
            res.json({ status: true })
        } else {
            res.json({ status: false })
        }
    } else {
        res.json({ status: false })
    }
}

module.exports.checkUser = async (req, res, next) => {

    const token = req.cookies._17JJLRaqFTVZzYL

    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {

            if (err) {
                res.locals.user = null;
                res.cookie("_17JJLRaqFTVZzYL", "", { maxAge: 1 });
                return res.status(200).json({
                    status: false,
                    msg: 'token not available or expired'
                })
            } else {

                const user = await customers.findOne({
                    where: {
                        id: decodedToken
                    },
                    attributes: [
                        "id",
                        "username",
                        "country",
                        "address",
                        "postal_code",
                    ],
                })
                res.locals.user = user;
                if (res.locals.user) {
                    next();
                } else {
                    res.cookie("_17JJLRaqFTVZzYL", "", { maxAge: 1 });
                    return res.status(200).json({
                        status: true,
                        msg: "you are not logged"
                    })

                }
            }
        });
    } else {
        res.locals.user = null;
        return res.status(200).json({
            status: false,
            msg: "no token provided"
        })
    }
}
