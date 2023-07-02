const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mcs_product_shop', {
    id_product: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    id_shop: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    id_category_default: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    id_tax_rules_group: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    on_sale: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    online_only: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    ecotax: {
      type: DataTypes.DECIMAL(17,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    minimal_quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    },
    low_stock_threshold: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    low_stock_alert: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    price: {
      type: DataTypes.DECIMAL(20,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    wholesale_price: {
      type: DataTypes.DECIMAL(20,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    unity: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    unit_price_ratio: {
      type: DataTypes.DECIMAL(20,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    additional_shipping_cost: {
      type: DataTypes.DECIMAL(20,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    customizable: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    uploadable_files: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    text_fields: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    active: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    redirect_type: {
      type: DataTypes.ENUM('','404','301-product','302-product','301-category','302-category'),
      allowNull: false,
      defaultValue: ""
    },
    id_type_redirected: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    available_for_order: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    available_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    show_condition: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    condition: {
      type: DataTypes.ENUM('new','used','refurbished'),
      allowNull: false,
      defaultValue: "new"
    },
    show_price: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    indexed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    visibility: {
      type: DataTypes.ENUM('both','catalog','search','none'),
      allowNull: false,
      defaultValue: "both"
    },
    cache_default_attribute: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    advanced_stock_management: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    date_add: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_upd: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pack_stock_type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 3
    }
  }, {
    sequelize,
    tableName: 'mcs_product_shop',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_product" },
          { name: "id_shop" },
        ]
      },
      {
        name: "id_category_default",
        using: "BTREE",
        fields: [
          { name: "id_category_default" },
        ]
      },
      {
        name: "date_add",
        using: "BTREE",
        fields: [
          { name: "date_add" },
          { name: "active" },
          { name: "visibility" },
        ]
      },
      {
        name: "indexed",
        using: "BTREE",
        fields: [
          { name: "indexed" },
          { name: "active" },
          { name: "id_product" },
        ]
      },
    ]
  });
};
