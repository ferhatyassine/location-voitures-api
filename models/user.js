import database from "../config/connection.js";
import Sequelize from "sequelize";

const DataTypes = Sequelize.DataTypes;
const User = database.define("User", {
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique:true },
    mdp: { type: DataTypes.STRING, allowNull: false },
    telephone: { type: DataTypes.STRING },
    naissance: { type: DataTypes.DATEONLY },
    num_permis: { type: DataTypes.STRING },
    expiration_permis: { type: DataTypes.DATEONLY, allowNull: false },
    photo: DataTypes.STRING,
    actif: { type: DataTypes.BOOLEAN, defaultValue:true, allowNull:false },
},{
    timestamps:false
})

export default User