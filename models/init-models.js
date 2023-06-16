var DataTypes = require("sequelize").DataTypes;
var _mcs_product = require("./mcs_product");
var _mcs_stock_available = require("./mcs_stock_available");
var _mobilax_brand_urls = require("./mobilax_brand_urls");
var _mobilax_links = require("./mobilax_links");
var _utopya_links = require("./utopya_links");

function initModels(sequelize) {
  var mcs_product = _mcs_product(sequelize, DataTypes);
  var mcs_stock_available = _mcs_stock_available(sequelize, DataTypes);
  var mobilax_brand_urls = _mobilax_brand_urls(sequelize, DataTypes);
  var mobilax_links = _mobilax_links(sequelize, DataTypes);
  var utopya_links = _utopya_links(sequelize, DataTypes);


  return {
    mcs_product,
    mcs_stock_available,
    mobilax_brand_urls,
    mobilax_links,
    utopya_links,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
