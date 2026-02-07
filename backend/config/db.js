const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config();

const dialect = process.env.DB_DIALECT || "postgres";

const isSqlite = dialect === "sqlite";

const sequelize = isSqlite
  ? new Sequelize({
      dialect: "sqlite",
      storage: process.env.SQLITE_STORAGE || path.join(__dirname, "..", "database.sqlite"),
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
      }
    );

module.exports = sequelize;
