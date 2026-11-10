import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

const RoleUser = sequelize.define('RoleUser', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    dateAttribution: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    statut: { type: DataTypes.STRING, defaultValue: 'actif' }
});