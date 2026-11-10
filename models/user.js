import database from "../config/connection.js";
import Sequelize from "sequelize";

const DataTypes = Sequelize.DataTypes;
const User = database.define("User", {
    nom: { type: DataTypes.STRING, allowNul: false },
    prenom: { type: DataTypes.STRING, allowNul: false },
    email: { type: DataTypes.STRING, allowNul: false, unique:true },
    mdp: { type: DataTypes.STRING, allowNul: false },
    telephone: { type: DataTypes.STRING, allowNul: false },
    naissance: { type: DataTypes.DATEONLY, allowNul: false },
    num_permis: { type: DataTypes.STRING, allowNul: false },
    expiration_permis: { type: DataTypes.DATEONLY, allowNul: false },
    photo: DataTypes.STRING,
    actif: { type: DataTypes.BOOLEAN }
},{
    timestamps:false
})

export default User