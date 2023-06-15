var DataTypes = require("sequelize").DataTypes;
var _mcs_product = require("./mcs_product");
var _mcs_stock_available = require("./mcs_stock_available");
var _products = require("./products");

function initModels(sequelize) {
  var mcs_product = _mcs_product(sequelize, DataTypes);
  var mcs_stock_available = _mcs_stock_available(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);


  return {
    mcs_product,
    mcs_stock_available,
    products,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
