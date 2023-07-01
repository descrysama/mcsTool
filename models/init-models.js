var DataTypes = require("sequelize").DataTypes;
var _concurent_links = require("./concurent_links");
var _config = require("./config");
var _mcs_image = require("./mcs_image");
var _mcs_product = require("./mcs_product");
var _mcs_product_lang = require("./mcs_product_lang");
var _mcs_stock_available = require("./mcs_stock_available");
var _mcstool_users = require("./mcstool_users");
var _mobilax_brand_urls = require("./mobilax_brand_urls");
var _mobilax_links = require("./mobilax_links");
var _utopya_links = require("./utopya_links");

function initModels(sequelize) {
  var concurent_links = _concurent_links(sequelize, DataTypes);
  var config = _config(sequelize, DataTypes);
  var mcs_image = _mcs_image(sequelize, DataTypes);
  var mcs_product = _mcs_product(sequelize, DataTypes);
  var mcs_product_lang = _mcs_product_lang(sequelize, DataTypes);
  var mcs_stock_available = _mcs_stock_available(sequelize, DataTypes);
  var mcstool_users = _mcstool_users(sequelize, DataTypes);
  var mobilax_brand_urls = _mobilax_brand_urls(sequelize, DataTypes);
  var mobilax_links = _mobilax_links(sequelize, DataTypes);
  var utopya_links = _utopya_links(sequelize, DataTypes);


  return {
    concurent_links,
    config,
    mcs_image,
    mcs_product,
    mcs_product_lang,
    mcs_stock_available,
    mcstool_users,
    mobilax_brand_urls,
    mobilax_links,
    utopya_links,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
