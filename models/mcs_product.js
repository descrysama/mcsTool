const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mcs_product_shop', {
    id_product: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    id_supplier: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    id_manufacturer: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    id_category_default: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    id_shop_default: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
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
    ean13: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    isbn: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    upc: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    mpn: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    ecotax: {
      type: DataTypes.DECIMAL(17,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    reference: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    supplier_reference: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    width: {
      type: DataTypes.DECIMAL(20,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    height: {
      type: DataTypes.DECIMAL(20,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    depth: {
      type: DataTypes.DECIMAL(20,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    weight: {
      type: DataTypes.DECIMAL(20,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    out_of_stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 2
    },
    additional_delivery_times: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    },
    quantity_discount: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
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
      type: DataTypes.ENUM('404','301-product','302-product','301-category','302-category'),
      allowNull: false,
      defaultValue: "404"
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
      defaultValue: 0
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
    cache_is_pack: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    cache_has_attachments: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    is_virtual: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    cache_default_attribute: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    date_add: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_upd: {
      type: DataTypes.DATE,
      allowNull: false
    },
    advanced_stock_management: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    pack_stock_type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 3
    },
    state: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    },
    product_type: {
      type: DataTypes.ENUM('standard','pack','virtual','combinations',''),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'mcs_product',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_product" },
        ]
      },
      {
        name: "reference_idx",
        using: "BTREE",
        fields: [
          { name: "reference" },
        ]
      },
      {
        name: "supplier_reference_idx",
        using: "BTREE",
        fields: [
          { name: "supplier_reference" },
        ]
      },
      {
        name: "product_supplier",
        using: "BTREE",
        fields: [
          { name: "id_supplier" },
        ]
      },
      {
        name: "product_manufacturer",
        using: "BTREE",
        fields: [
          { name: "id_manufacturer" },
          { name: "id_product" },
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
        name: "indexed",
        using: "BTREE",
        fields: [
          { name: "indexed" },
        ]
      },
      {
        name: "date_add",
        using: "BTREE",
        fields: [
          { name: "date_add" },
        ]
      },
      {
        name: "state",
        using: "BTREE",
        fields: [
          { name: "state" },
          { name: "date_upd" },
        ]
      },
    ]
  });
};
