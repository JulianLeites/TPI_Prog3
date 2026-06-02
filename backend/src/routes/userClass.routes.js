import { Router } from 'express';
import {
    assignUserToClass,
    removeUserFromClass
} from '../controllers/userClassController.js';

const router = Router();

router.post('/users/:user_id/classes/:class_id', assignUserToClass);
router.delete('/users/:user_id/classes/:class_id', removeUserFromClass);

export default router;