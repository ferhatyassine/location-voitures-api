import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

const RoleUser = sequelize.define('RoleUser', {
    RoleId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    UserId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
}, {
    timestamps: false,
});

export default RoleUser