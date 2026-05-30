// User_membership
// Id
// User_id
// Membership_id
// Date_start
// Date_end
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
        references: {
            model: 'users',
            key: 'id'
        }
    },
    membership_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'memberships',
            key: 'id'
        }
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
    tableName: 'User_Membership'
});