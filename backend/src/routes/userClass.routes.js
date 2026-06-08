import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
    assignUserToClass,
    removeUserFromClass,
    getUserEnrolledClasses,
    adminRemoveUserFromClass
} from '../controllers/userClassController.js';

const router = Router();

router.get('/classes', verifyToken, getUserEnrolledClasses)
router.get('/classes/user/:id', verifyToken, getUserEnrolledClasses)

router.post('/classes/assign/:class_id', verifyToken, assignUserToClass);

router.delete('/classes/:class_id/user/:userId', verifyToken, adminRemoveUserFromClass)
router.delete('/classes/:class_id', verifyToken, removeUserFromClass);


export default router;