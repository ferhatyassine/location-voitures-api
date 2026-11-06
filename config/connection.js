import { Sequelize } from "sequelize";
import dotenv from "dotenv";

const { DB_NAME, DB_USER, DB_PASSWORD, DB_PORT, DB_DIALECT, DB_HOST } =
  dotenv.config().parsed;

//creer la connexion a MySQL

const database = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  port: DB_PORT,
});

export default database;
