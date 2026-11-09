import { DataTypes } from "sequelize";
import database from "../config/connection.js";

const Categorie = database.define(
  "Categorie",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    prix_jour_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    caution: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    age_minimum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "categories",
    timestamps: false,
  }
);

export default Categorie;