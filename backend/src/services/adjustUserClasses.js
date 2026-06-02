import { Membership } from '../models/Membership.js';
import { User_Class } from '../models/User_Class.js';
import { User_Membership } from '../models/User_Membership.js';

export const adjustUserClasses = async (userId) => {
    try {
        const activeMembership = await User_Membership.findOne({
            where: {
                user_id: userId,
                active: true
            },
            include: Membership
        });
        if (activeMembership) {
            const currentClassCount = await User_Class.count({ where: { user_id: userId }});
            if (currentClassCount > activeMembership.Membership.max_classes) {
                
                const userClasses = await User_Class.findAll({ where: { user_id: userId }, order: [['enrollment_date', 'DESC']] });
                const classesToRemove = userClasses.slice(0, userClasses.length - activeMembership.Membership.max_classes);
                
                for (const userClass of classesToRemove) {
                    await userClass.destroy();
                    console.log(`Removed class with ID ${userClass.class_id} from user with ID ${userId} due to membership class limit.`);
                }
            }
        }
    } catch (error) {
        console.error('Error occurred while adjusting user classes', error);
    }
};