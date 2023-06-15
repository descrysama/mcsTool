const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mcs_stock_available', {
    id_stock_available: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    id_product: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    id_product_attribute: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    id_shop: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    id_shop_group: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    physical_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    reserved_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    depends_on_stock: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    out_of_stock: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'mcs_stock_available',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_stock_available" },
        ]
      },
      {
        name: "product_sqlstock",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_product" },
          { name: "id_product_attribute" },
          { name: "id_shop" },
          { name: "id_shop_group" },
        ]
      },
      {
        name: "id_shop",
        using: "BTREE",
        fields: [
          { name: "id_shop" },
        ]
      },
      {
        name: "id_shop_group",
        using: "BTREE",
        fields: [
          { name: "id_shop_group" },
        ]
      },
      {
        name: "id_product",
        using: "BTREE",
        fields: [
          { name: "id_product" },
        ]
      },
      {
        name: "id_product_attribute",
        using: "BTREE",
        fields: [
          { name: "id_product_attribute" },
        ]
      },
    ]
  });
};
