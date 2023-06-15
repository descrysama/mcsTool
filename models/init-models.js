var DataTypes = require("sequelize").DataTypes;
var _products = require("./products");
var _wholesale_url = require("./wholesale_url");

function initModels(sequelize) {
  var products = _products(sequelize, DataTypes);
  var wholesale_url = _wholesale_url(sequelize, DataTypes);

  wholesale_url.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(wholesale_url, { as: "wholesale_urls", foreignKey: "product_id"});

  return {
    products,
    wholesale_url,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
