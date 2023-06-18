const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mcs_product_lang', {
    id_product: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    id_shop: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      primaryKey: true
    },
    id_lang: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description_short: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    link_rewrite: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    meta_description: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    meta_keywords: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    meta_title: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    available_now: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    available_later: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    delivery_in_stock: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    delivery_out_stock: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mcs_product_lang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_product" },
          { name: "id_shop" },
          { name: "id_lang" },
        ]
      },
      {
        name: "id_lang",
        using: "BTREE",
        fields: [
          { name: "id_lang" },
        ]
      },
      {
        name: "name",
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "ets_seo_rr",
        using: "BTREE",
        fields: [
          { name: "link_rewrite" },
        ]
      },
    ]
  });
};
