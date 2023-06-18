const { Sequelize, DataTypes } = require('sequelize');
const db = require("../models");
const mcsConfig = db.mcsConfig;

async function addOrChangeConfig(req, res) {
    const config = await mcsConfig.findOne({ where: { id: 1 } });
    const { mobilax_email, utopya_email, mobilax_password, utopya_password, mcs_image_key } = req.body;

    if (mobilax_email === null || utopya_email === null || mobilax_password === null || utopya_password === null || mcs_image_key === null) {
        res.json({error: "Veuillez rentrer tout les champs."})
    }

    if(!config) {
        const newConfig = await mcsConfig.create(req.body)
        return res.json(newConfig)
    } else {
        await mcsConfig.update(req.body, {
            where: {
                id: 1
            }
        });
        const updatedConfig = await mcsConfig.findOne({ where: { id: 1 } }); // Retrieve the updated record
        return res.json(updatedConfig);
    }
}

async function get(req, res) {
    const config = await mcsConfig.findOne({ where: { id: 1 } });

    if(config) {
        return res.json(config);
    } else {
        return res.json({error: 'Aucune config.'})
    }
}









//external function
const parsedValues = (array) => {
  let parsedArray = [];
  array.forEach(item => parsedArray.push(item.dataValues));
  return parsedArray
}

module.exports = {
    get,
    addOrChangeConfig
};
