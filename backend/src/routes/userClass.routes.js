import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
    assignUserToClass,
    removeUserFromClass
} from '../controllers/userClassController.js';

const router = Router();

router.post('/classes/assign/:class_id', verifyToken, assignUserToClass);
router.delete('/users/:user_id/classes/:class_id/delete', verifyToken, removeUserFromClass);

export default router;