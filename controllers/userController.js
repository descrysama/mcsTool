const {hashPassword, comparePassword} = require('../tools/hashPassword');
const jwt = require('jsonwebtoken');
const db = require("../models");
const customers = db.customers;
const Op = db.Sequelize.Op;


module.exports.checkToken = (req, res) => {
    const token = req.cookies.jwt ? req.cookies.jwt : null
    const id = req.cookies.jwt ? jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET) : null;
    if (token) {
        if (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
            res.json({
                status: true,
                message: "Token valide.",
                id : id
            })
        } else {
            res.json({
                status: false,
                message: "Token invalide."
            })
        }
    } else {
        res.json({
            status: false,
            message: "Token non trouvé."
        })
    }
}

module.exports.logout = async(req, res) => {
    res.cookie("_17JJLRaqFTVZzYL", "", { maxAge: 1 });
    res.json({message: "Logout successful..."})
},

module.exports.login = async(req, res) => {
    const { username , password } = req.body;

    if(!username || !password) {
        return res.status(500).json({
            error: "Missing credential(s)."
        })
    }

    const user = await customers.findOne({
        where: {
            username: username
        }
    });

    try {
        if (user) {
            if (comparePassword(password, user.password)) {
                const token = jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)
                const maxAge = 3 * 60 * 60 * 1000;
                res.cookie("_17JJLRaqFTVZzYL", token, {
                    httpOnly: true,
                    maxAge
                })
                
                res.setHeader('Set-Cookie', '_17JJLRaqFTVZzYL='+ token + '; Path=/;');
                res.status(200).json({
                    boolean: true,
                    message: 'Connexion Réussie, redirection...'
                })

            } else {
                res.json({
                    boolean: false,
                    message: "Email and/or password incorrect"
                })
            }
        } else {
            res.json({
                boolean: false,
                message: "Email and/or password incorrect"
            })
        }
    } catch(error) {
        res.json({
            error: error
        })
    }
}

module.exports.register = async(req , res) => {
    const { username } = req.body;
    const rawPassword = req.body.password;

    if(!username || !rawPassword) {
        return res.json({
            error: "Email or password missing."
        })
    }

    const password = hashPassword(req.body.password);
    

    try {
        const data = await customers.create({
            username: username,
            password: password
        })
        if (data) {
            res.json({
                status: true,
                message: 'Register successful !'
            })
        } else {
            res.json({
                status: false,
                error: 'Incorrect field(s) !'
            })
        }
    } catch (error) {
        res.json({
            error: error
        })
    }

}

module.exports.getUser = async(req, res) => {

    try {
        const user = await customers.findOne({
            where: {
                id: res.locals.user.id
            },
            attributes: [
                "id",
                "username",
                "country",
                "address",
                "postal_code",
            ],
        })

        return res.status(200).json(user);
    } catch(error) {
        return res.status(500).json({
            error: "An error has occured."
        });
    }
}

module.exports.addAddress = async(req, res) => {
    const { country, address, postal_code } = req.body;
    if(!country || !address || !postal_code) {
        return res.status(500).json({
            error: "Field missing check what you entered."
        })
    }

    if(country.length > 256 || address.length > 256 || postal_code.length > 256 ) {
        return res.status(500).json({
            error: "One of your field is longer than expected."
        })
    }

    try {
        const updatedCustomers = await customers.update({country, address, postal_code}, {
            where: {
                id: res.locals.user.id
            },
        });

        return res.status(200).json({
            boolean : true,
            message: updatedCustomers[0] == 1 ? "Address successfully updated." : updatedCustomers[0] == 0 ? "You haven't changed nothing" : ""
        })

    } catch(error) {
        return res.status(500).json({
            error: error
        })
    }

    
}