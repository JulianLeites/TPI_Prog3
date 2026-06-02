import cron from 'node-cron'
import { User_Membership } from '../models/User_Membership.js';
import { Op } from 'sequelize';

cron.schedule('0 */6 * * *', async() => {
    try {
        const now = new Date();
        const expiredMemberships = await User_Membership.findAll({
            where: {
                date_end: {
                    [Op.lt]: now
                },
                active: true
            }
        });
        for (const membership of expiredMemberships) {
            if (membership.automatic_renewal) {
                membership.date_end = new Date(membership.date_end.getTime() + 30 * 24 * 60 * 60 * 1000);
                console.log(`Membership with ID ${membership.id} has been automatically renewed until ${membership.date_end}.`);
                await membership.save();
            } else {
                membership.active = false;
                console.log(`Membership with ID ${membership.id} has expired and will be deactivated.`);
                await membership.save();
            }
        }
        const startNewMemberships = await User_Membership.findAll({
            where: {
                date_start: {
                    [Op.lte]: now
                },
                date_end: {
                    [Op.gt]: now
                },
                active: false
            }
        });
        for (const membership of startNewMemberships) {
            membership.active = true;
            console.log(`Membership with ID ${membership.id} has started.`);
            await membership.save();
        }

    } catch (error) {
        console.error('Error occurred while checking membership expiration:', error);
    }
})