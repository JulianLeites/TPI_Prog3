import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
    assignUserToClass,
    removeUserFromClass,
    getUserEnrolledClasses
} from '../controllers/userClassController.js';

const router = Router();

router.post('/classes/assign/:class_id', verifyToken, assignUserToClass);
router.delete('/profile/classes/:class_id', verifyToken, removeUserFromClass);

router.get('/profile/classes', verifyToken, getUserEnrolledClasses)

export default router;