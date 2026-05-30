import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
export const Membership = sequelize.define('Membership', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    duration_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30
    }
}, {
    timestamps: false,
    tableName: 'memberships'
});