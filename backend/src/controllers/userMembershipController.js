import { User_Membership } from '../models/User_Membership.js';
import { User } from '../models/users.js';
import { Membership } from '../models/membership.js';

export const assignMembershipToUser = async (req, res) => {
    const { user_id, membership_id } = req.params;
    // const { date_end } = req.body;

    try {
        const user = await User.findByPk(user_id);
        const membership = await Membership.findByPk(membership_id);

        if (!user || !membership) {
            return res.status(404).json({ message: 'User or Membership not found' });
        }

        const existing = await User_Membership.findOne({ where: { user_id: user_id, membership_id: membership_id } });

        if (existing) {
            return res.status(400).json({ message: 'User already has this membership' });
        }
        const userMembership = await User_Membership.create({
            user_id: user_id,
            membership_id: membership_id,
            date_start: new Date(),
            date_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        res.status(201).json(userMembership);
    } catch (error) {
        res.status(500).json({ message: 'Error associating user with membership', error });
    }
};