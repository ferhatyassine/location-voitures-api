import { DataTypes } from "sequelize";
import database from "../config/connection.js";

const Role = database.define("Role", {
    libelle_role: { type: DataTypes.STRING, allowNull: false, unique:true },
    description: {type: DataTypes.STRING, allowNull: false}
},{
    timestamps:false
})

export default Role