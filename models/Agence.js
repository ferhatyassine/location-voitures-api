import { DataTypes } from "sequelize";
import database from "../config/connection.js";

const Agence = database.define(
  "Agence",
  {
    nom: { type: DataTypes.STRING(100), allowNull: false },
    adresse: { type: DataTypes.STRING, allowNull: false },
    ville: { type: DataTypes.STRING(50), allowNull: false },
    code_postal: { type: DataTypes.STRING(10), allowNull: false },
    telephone: { type: DataTypes.STRING(20) },
    heure_ouverture: { type: DataTypes.TIME, allowNull: false },
    heure_fermeture: { type: DataTypes.TIME, allowNull: false },
    image: DataTypes.STRING,
  },
  { timestamps: false },
);

export default Agence;
