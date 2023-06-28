const {hashPassword, comparePassword} = require('../tools/hashPassword');
const jwt = require('jsonwebtoken');
const db = require("../models");
const users = db.users;
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
    res.cookie("_auth", "", { maxAge: 1 });
    res.json({message: "Deconnexion réussi"})
},

module.exports.login = async(req, res) => {
    const { email , password } = req.body;

    const user = await users.findOne({
        where: {
            email: email
        }
    });

    try {
        if (user) {
            if (comparePassword(password, user.password)) {
                const token = jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)
                const maxAge = 3 * 24 * 60 * 60 * 1000;
                res.cookie("_auth", token, {
                    httpOnly: true,
                    maxAge
                })
                
                res.setHeader('Set-Cookie', '_auth='+ token + '; Path=/;');
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
    const { email, special_key } = req.body;
    const password = hashPassword(req.body.password);

    if(special_key !== process.env.SPECIAL_KEY) {
        return res.json({error: "Special key non correct."})
    }

    if(!email || !password) {
        return res.json({
            error: "Mot de passe ou email manquant."
        })
    }

    try {
        const data = await users.create({
            email: email,
            password: password
        })
        if (data) {
            res.json({
                status: true,
                message: 'Inscription Réussie'
            })
        } else {
            res.json({
                status: false,
                error: 'Champs incorrects'
            })
        }
    } catch (error) {
        res.json({
            error: error
        })
    }

}