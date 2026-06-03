import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { User } from './users.js';
import { Class } from './Classes.js';
import { Membership } from './membership.js';
import { User_Class } from './User_Class.js';
import { User_Membership } from './User_Membership.js';

User.belongsToMany(Class, { through: User_Class, foreignKey: 'user_id' });
Class.belongsToMany(User, { through: User_Class, foreignKey: 'class_id' });

User.hasMany(User_Membership, { foreignKey: 'user_id' });
User_Membership.belongsTo(User, { foreignKey: 'user_id' });

Membership.hasMany(User_Membership, { foreignKey: 'membership_id' });
User_Membership.belongsTo(Membership, { foreignKey: 'membership_id' });

User.hasMany(Class, { foreignKey: 'teacher_id' });
Class.belongsTo(User, { foreignKey: 'teacher_id' });