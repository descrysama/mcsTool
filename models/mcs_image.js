const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mcs_image', {
    id_image: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    id_product: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    position: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    cover: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mcs_image',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_image" },
        ]
      },
      {
        name: "id_product_cover",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_product" },
          { name: "cover" },
        ]
      },
      {
        name: "idx_product_image",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_image" },
          { name: "id_product" },
          { name: "cover" },
        ]
      },
      {
        name: "image_product",
        using: "BTREE",
        fields: [
          { name: "id_product" },
        ]
      },
    ]
  });
};
