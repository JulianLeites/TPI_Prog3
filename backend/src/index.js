import express from 'express';
import cors from 'cors';
import { sequelize } from './db.js';
import { PORT } from './config.js';
import userRoutes from './routes/users.routes.js';
import classRoutes from './routes/classes.routes.js';
import membershipRoutes from './routes/membership.routes.js';
import userMembershipRoutes from './routes/userMembership.routes.js';
import userClassRoutes from './routes/userClass.routes.js';
import './jobs/membershipExpiration.js';

import './models/Associations.js';
import { User } from './models/users.js';
import { Class } from './models/Classes.js';
import { Membership } from './models/membership.js';
import { User_Class } from './models/User_Class.js';
import { User_Membership } from './models/User_Membership.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Gym Management System API');
});

app.use(userRoutes);
app.use(membershipRoutes);
app.use(classRoutes);
app.use(userMembershipRoutes);
app.use(userClassRoutes);

async function main() {
    try {
        await sequelize.sync({ force: false });
        console.log('Database connected and synced successfully');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error(`Unable to connect to the database`, error);
    }
}

main();