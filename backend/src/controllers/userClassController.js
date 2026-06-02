import { User_Class } from '../models/User_Class.js';
import { User_Membership } from '../models/User_Membership.js';
import { User } from '../models/users.js';
import { Class } from '../models/Classes.js';

export const assignUserToClass = async (req, res) => {
    const { user_id, class_id } = req.params;
    const userId = parseInt(user_id);
    const classId = parseInt(class_id);

    try {
        const user = await User.findByPk(userId);
        const gymClass = await Class.findByPk(classId);
        if (!user || !gymClass) {
            return res.status(404).json({ message: 'User or Class not found' });
        }
        const userClass = await User_Class.findOne({ where: { user_id: userId, class_id: classId } });
        if (userClass) {
            return res.status(400).json({ message: 'User is already assigned to this class' });
        }

        const activeMembership = await User_Membership.findOne({ where: { user_id: userId, active: true } });
        if (!activeMembership) {
            return res.status(400).json({ message: 'User must have an active membership to be assigned to a class' });
        }

        if (activeMembership.max_classes <= await User_Class.count({ where: { user_id: userId } })) {
            return res.status(400).json({ message: 'User has reached the maximum number of classes allowed' });
        }

        if (gymClass.capacity <= await User_Class.count({ where: { class_id: classId } })) {
            return res.status(400).json({ message: 'Class is at full capacity' });
        }

        const newUserClass = await User_Class.create({ user_id: userId, class_id: classId });
        return res.status(201).json({ message: 'Class assigned to user successfully', userClass: newUserClass });
    } catch (error) {
        res.status(500).json({ message: 'Error associating user with class', error });
    }
};

export const removeUserFromClass = async (req, res) => {
    const { user_id, class_id } = req.params;
    const userId = parseInt(user_id);
    const classId = parseInt(class_id);

    try {
        const userClass = await User_Class.findOne({ where: { user_id: userId, class_id: classId } });
        if (!userClass) {
            return res.status(404).json({ message: 'User is not assigned to this class' });
        }
        await userClass.destroy();
        return res.status(200).json({ message: 'Class removed from user successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing class from user', error });
    }
};