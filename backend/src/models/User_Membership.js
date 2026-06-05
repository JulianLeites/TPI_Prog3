import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const User_Membership = sequelize.define('User_Membership', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    membership_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: 'memberships',
            key: 'id'
        }
    },
    automatic_renewal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    date_start: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    date_end: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'User_Membership',
    indexes: []
});