import { DataTypes } from "sequelize";
import database from "../config/connection.js";

const Voiture = database.define(
  "Voiture",
  {
    id_voiture: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    modele: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    annee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    immatriculation: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },

    vin: {
      type: DataTypes.STRING(17),
      unique: true,
      allowNull: false,
    },

    couleur: {
      type: DataTypes.STRING(30),
    },

    carburant: {
      type: DataTypes.STRING(20),
    },

    transmission: {
      type: DataTypes.STRING(20),
    },

    nb_places: {
      type: DataTypes.INTEGER,
    },

    kilometrage: {
      type: DataTypes.INTEGER,
    },

    prix_jour: {
      type: DataTypes.DECIMAL(8, 2),
    },

    statut: {
      type: DataTypes.STRING(20),
    },

    photo: {
      type: DataTypes.STRING(255),
    },

    id_marque: {
      type: DataTypes.INTEGER,
    },

    id_categorie: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "voitures",
    timestamps: false,
  }
);

export default Voiture;