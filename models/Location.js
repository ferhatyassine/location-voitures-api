import { DataTypes } from "sequelize";
import database from "../config/connection.js";

const Location = database.define(
  "Location",
  {
    numero_contrat: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    date_retrait: { type: DataTypes.DATE, allowNull: false },
    date_retour_prevue: { type: DataTypes.DATE, allowNull: false },
    date_retour_reelle: { type: DataTypes.DATE },
    km_depart: DataTypes.INTEGER,
    km_retour: DataTypes.INTEGER,
    montant_total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    frais_retard: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
    statut: {
      type: DataTypes.ENUM("reservee", "en_cours", "terminee", "annulee"),
      defaultValue: "reservee",
    },
  },
  {
    timestamps: false,
  },
);

export default Location;
