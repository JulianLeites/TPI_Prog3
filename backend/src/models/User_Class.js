import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
export const User_Class = sequelize.define('User_Class', {
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
    class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'classes',
            key: 'id'
        }
    },
    enrollment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'User_Class'
});