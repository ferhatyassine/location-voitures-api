import { DataTypes } from "sequelize";
import database from "../config/connection.js";

const Paiement = database.define(
  "Paiement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    date_paiement: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        "location",
        "caution",
        "penalite",
        "remboursement"
      ),
      allowNull: false,
    },

    methode: {
      type: DataTypes.ENUM(
        "carte",
        "especes",
        "virement",
        "paypal"
      ),
      allowNull: false,
    },

    statut: {
      type: DataTypes.ENUM(
        "en_attente",
        "paye",
        "annule",
        "rembourse"
      ),
      defaultValue: "en_attente",
    },

    reference: {
      type: DataTypes.STRING(50),
      unique: true,
    },

    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "paiements",
    timestamps: false,
  }
);

export default Paiement;