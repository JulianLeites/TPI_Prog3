import express from 'express';
import { sequelize } from './db.js';
import { PORT } from './config.js';
import userRoutes from './routes/users.routes.js';
import classRoutes from './routes/classes.routes.js';
import membershipRoutes from './routes/membership.routes.js';

import './models/Associations.js';
import { User } from './models/users.js';
import { Class } from './models/Classes.js';
import { Membership } from './models/membership.js';
import { User_Class } from './models/User_Class.js';
import { User_Membership } from './models/User_Membership.js';

const app = express();

try {
    app.get('/', (req, res) => {
        res.send('Welcome to the Gym Management System API');
    });
    app.use(express.json());
    app.listen(PORT);
    app.use(userRoutes, classRoutes, membershipRoutes);

    await sequelize.sync();

    console.log(`Server running on port ${PORT}`);

} catch (error) {
    console.error(`Unable to connect to the database`);
}