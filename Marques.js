import { DataTypes } from "sequelize";
import database from "./config/connection.js";

const Marque = database.define(
  "Marque",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nom: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    pays: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    logo: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "marques",
    timestamps: false,
  }
);

export default Marque;