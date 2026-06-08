import { User_Class } from '../models/User_Class.js';
import { User_Membership } from '../models/User_Membership.js';
import { User } from '../models/users.js';
import { Class } from '../models/Classes.js';
import { Membership } from '../models/membership.js';

export const assignUserToClass = async (req, res) => {
    const { class_id } = req.params;
    const userId = req.user.id;
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

        const activeMembership = await User_Membership.findOne({ where: { user_id: userId, active: true }, include: Membership });
        if (!activeMembership) {
            return res.status(400).json({ message: 'User must have an active membership to be assigned to a class' });
        }

        const maxClasses = activeMembership.Membership.max_classes;
        const currentClassCount = await User_Class.count({ where: { user_id: userId } });
        if (currentClassCount >= maxClasses) {
            return res.status(400).json({ message: `User has reached the maximum number of classes allowed by their membership (${maxClasses})` });
        }

        if (gymClass.capacity <= await User_Class.count({ where: { class_id: classId } })) {
            return res.status(400).json({ message: 'Class is at full capacity' });
        }

        const newUserClass = await User_Class.create({ user_id: userId, class_id: classId });

        await gymClass.decrement('capacity', { by: 1})
        return res.status(201).json({ message: 'Class assigned to user successfully', userClass: newUserClass });
    } catch (error) {
        res.status(500).json({ message: 'Error associating user with class', error });
    }
};

export const removeUserFromClass = async (req, res) => {
    const { class_id } = req.params
    const userId = req.user.id
    const classId = parseInt(class_id);

    if(isNaN(classId)) {
        return res.status(400).json({ message: 'Invalid class Id'})
    }

    try {
        const userClass = await User_Class.findOne({ where: { user_id: userId, class_id: classId } });
        if (!userClass) {
            return res.status(404).json({ message: 'User is not assigned to this class' });
        }

        const gymClass = await Class.findByPk(classId)

        await userClass.destroy();

        if(gymClass){
            await gymClass.increment('capacity', {by:1})
        }
        return res.status(200).json({ message: 'Class removed from user successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing class from user', error });
    }
};

export const getUserEnrolledClasses = async (req, res) => {
    const userId = req.user.id

    try {
        const enrollments = await User_Class.findAll({
            where: {user_id: userId},
            attributes: ['id', 'class_id', 'enrollment_date']
        })

        if(!enrollments || enrollments.length === 0) {
            return res.json([])
        }

        const classIds = enrollments.map(e => e.class_id)

        const classesData = await Class.findAll({
            where: {id: classIds},
            attributes: ['id', 'name', 'day', 'hour']
        })

        const response = enrollments.map(enrollment => {
            const clasInfo = classesData.find(c => c.id === enrollment.class_id)
            return {
                id: enrollment.id,
                enrollment_date: enrollment.enrollment_date,
                Class: clasInfo || null
            }
        })

        res.json(response)
    }catch(error) {
        console.error('Error at getUserEnrolledClasses: ', error)
        res.status(500).json({ error: 'Failed to retreive enrolled classes'})
    }
}