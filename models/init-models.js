var DataTypes = require("sequelize").DataTypes;
var _btc_addresses = require("./btc_addresses");
var _customers = require("./customers");
var _orders = require("./orders");
var _product_orders = require("./product_orders");
var _products = require("./products");

function initModels(sequelize) {
  var btc_addresses = _btc_addresses(sequelize, DataTypes);
  var customers = _customers(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var product_orders = _product_orders(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);

  product_orders.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(product_orders, { as: "product_orders", foreignKey: "order_id"});
  product_orders.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_orders, { as: "product_orders", foreignKey: "product_id"});

  return {
    btc_addresses,
    customers,
    orders,
    product_orders,
    products,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
