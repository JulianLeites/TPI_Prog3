import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    getClassAssignedToTeacher
} from '../controllers/classController.js';

const router = Router();

router.get('/classes', getAllClasses);
router.post('/classes', verifyToken, createClass);

router.get('/classes/teacher/:id', verifyToken, getClassAssignedToTeacher)

router.get('/classes/:id', verifyToken, getClassById);
router.put('/classes/:id', verifyToken, updateClass);
router.delete('/classes/:id', verifyToken, deleteClass);

export default router;