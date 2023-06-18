const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('config', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mobilax_email: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    mobilax_password: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    utopya_email: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    utopya_password: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    mcs_image_key: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'config',
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
