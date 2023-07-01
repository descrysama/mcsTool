const { SequelizeAuto } = require('sequelize-auto');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.MARIADB_DATABASE_NAME, process.env.MARIADB_USERNAME, process.env.MARIADB_PASSWORD, {
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  dialect: 'mariadb',
  logging: false,
  operatorsAliases: false
});

// const sequelizeauto = new SequelizeAuto(process.env.MARIADB_DATABASE_NAME, process.env.MARIADB_USERNAME, process.env.MARIADB_PASSWORD, {
//   host: process.env.MARIADB_HOST,
//   port: process.env.MARIADB_PORT,
//   dialect: 'mariadb',
//   logging: false,
//   operatorsAliases: false
// });

// sequelizeauto.run((err) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Models generated successfully.');
//   }
// });

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products = require("./mcs_product.js")(sequelize, Sequelize);
db.stockAvailable = require("./mcs_stock_available.js")(sequelize, Sequelize);
db.mobilaxBrandUrls = require("./mobilax_brand_urls.js")(sequelize, Sequelize);
db.mobilaxLinks = require("./mobilax_links.js")(sequelize, Sequelize);
db.utopyaLinks = require("./utopya_links.js")(sequelize, Sequelize);
db.mcsImages = require("./mcs_image.js")(sequelize, Sequelize);
db.mcsConfig = require("./config.js")(sequelize, Sequelize);
db.mcsProductLang = require("./mcs_product_lang.js")(sequelize, Sequelize);
db.users = require("./mcstool_users.js")(sequelize, Sequelize);
db.concurentLinks = require("./concurent_links.js")(sequelize, Sequelize);

module.exports = db;