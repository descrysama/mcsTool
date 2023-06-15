require('dotenv').config();
const jwt = require('jsonwebtoken')

module.exports.authToken = (req, res, next) => {
    const token = req.cookies._auth || null;

    if (token) {
        if (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
            next()
        } else {
            res.json({
                message: 'Invalid token'
            })
        }
    } else {
        res.status(500).json({})
    }
}

module.exports.checkAuth = (req, res, next) => {
    const token = req.cookies._auth || null;

    if (token) {
        if (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
            res.json({status: true})
        } else {
            res.json({status: false})
        }
    } else {
        res.json({status: false})   
    }
}
