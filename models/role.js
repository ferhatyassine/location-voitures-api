import { DataTypes } from "sequelize";
import database from "../config/connection.js";

const Role = database.define("Role", {
    titre: {
        type: DataTypes.ENUM("client", "employe", "administrateur"),
        allowNull: false,
        unique: true,
    },
},{
    timestamps:false
})

export default Role