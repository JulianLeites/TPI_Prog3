import { User_Membership } from '../models/User_Membership.js';
import { User } from '../models/users.js';
import { Membership } from '../models/membership.js';
import { Op } from 'sequelize';

export const assignMembershipToUser = async (req, res) => {
    const { user_id, membership_id } = req.params;
    const userId = parseInt(user_id);
    const membershipId = parseInt(membership_id);

    try {
        const user = await User.findByPk(userId);
        const membership = await Membership.findByPk(membershipId);

        if (!user || !membership) {
            return res.status(404).json({ message: 'User or Membership not found' });
        }

        const userMembership = await User_Membership.findOne({ where: { user_id: userId, active: true }});
        const pendingMembership = await User_Membership.findOne({ where: { user_id: userId, date_start: { [Op.gt]: new Date() } } });

        if (pendingMembership) {
            return res.status(400).json({ message: 'User already has a pending membership' });
        }

        if (userMembership && userMembership.membership_id !== membershipId) {
            const newUserMembership = await User_Membership.create({
                user_id: userId,
                membership_id: membershipId,
                date_start: userMembership.date_end,
                date_end: new Date(userMembership.date_end.getTime() + 30 * 24 * 60 * 60 * 1000),
                active: false,
            });
            userMembership.automatic_renewal = false;
            await userMembership.save();
            return res.status(200).json({ message: 'User has an active membership. New membership will start after the current one expires.' });
        } else if (userMembership && userMembership.membership_id == membershipId) {
            return res.status(400).json({ message: 'User already has this membership' });
        } else {
            const newUserMembership = await User_Membership.create({
                user_id: userId,
                membership_id: membershipId,
                date_start: new Date(),
                date_end: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
            });
            return res.status(201).json({ message: 'Membership assigned to user successfully', userMembership: newUserMembership });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error associating user with membership', error });
    }
};

export const cancelMembership = async (req, res) => {
    const { user_id } = req.params;

    try {
        const userMembership = await User_Membership.findOne({ 
            where: { 
                user_id: user_id,
                active: true,
                date_end: {
                    [Op.gt]: new Date()
                }
            } 
            });
        if (!userMembership) {
            return res.status(404).json({ message: 'User membership not found' });
        }

        if (!userMembership.automatic_renewal) {
            return res.status(400).json({ message: 'Membership already cancelled' });
        }
        userMembership.automatic_renewal = false;
        await userMembership.save();

        const pendingMembership = await User_Membership.findOne({ where: { user_id: user_id, date_start: { [Op.gt]: new Date() } } });
        if (pendingMembership) {
            pendingMembership.automatic_renewal = false;
            await pendingMembership.save();
        }

        res.status(200).json({ message: 'Membership cancellation successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling membership', error });
    }
};