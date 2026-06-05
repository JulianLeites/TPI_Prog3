import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
} from '../controllers/classController.js';

const router = Router();

router.get('/classes', getAllClasses);
router.get('/classes/:id', verifyToken, getClassById);
router.post('/classes', verifyToken, createClass);
router.put('/classes/:id', verifyToken, updateClass);
router.delete('/classes/:id', verifyToken, deleteClass);

export default router;