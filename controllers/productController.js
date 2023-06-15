
const db = require("../models");
const products = db.products;

async function getAll(req, res) {

  try {
    const allProducts = await products.findAll();
    if (!allProducts) {
      return res.status(500).json({error: "Aucun produit trouvés."});
    }

    return res.status(200).json(allProducts);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ error: 'Server error' });
    
  }
}

async function get(req, res) {
  if (!Number.isInteger(parseInt(req.params.page))) {
      return res.status(500).json({ error: "Page non valide." })
  }

  const page = parseInt(req.params.page);
  const skip = (page - 1) * 20;
  const limit = 20;

  try {
    const allProducts = await products.findAll({
      offset: skip,
      limit: limit,
    });
    if (!allProducts) {
      return res.status(500).json({error: "Aucun produit trouvés."});
    }

    return res.status(200).json(allProducts);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ error: 'Server error' });
    
  }
}




module.exports = {
  getAll,
  get
};
