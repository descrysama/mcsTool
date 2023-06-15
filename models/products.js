const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reference: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prix_achat: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    prix_vente: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    stock: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'products',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
