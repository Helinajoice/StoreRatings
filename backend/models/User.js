const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING(60), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  address: { type: DataTypes.STRING(400) },
  password: { type: DataTypes.STRING, allowNull: false },

  role: {
    type: DataTypes.ENUM("USER", "ADMIN", "STORE_OWNER"),
    defaultValue: "USER"
  },

  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  verification_code: {
    type: DataTypes.STRING(6)
  }
});

module.exports = User;
