const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");

const Rating = sequelize.define("Rating", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Rating.belongsTo(User, { foreignKey: "userId", as: "user" });
Rating.belongsTo(Store, { foreignKey: "storeId", as: "store" });

module.exports = Rating;

