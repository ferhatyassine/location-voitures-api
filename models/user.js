import database from "../config/connection.js";
import Sequelize from "sequelize";

const DataTypes = Sequelize.DataTypes;
const User = database.define("User", {
    nom: { type: DataTypes.STRING(50), allowNull: false },
    prenom: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    mdp: { type: DataTypes.STRING(255), allowNull: false },
    telephone: { type: DataTypes.STRING(20) },
    naissance: { type: DataTypes.DATEONLY, allowNull: false },
    num_permis: { type: DataTypes.STRING(30) },
    expiration_permis: { type: DataTypes.DATEONLY },
    photo: { type: DataTypes.STRING(255) },
    actif: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
},{
    timestamps:false
})

export default User