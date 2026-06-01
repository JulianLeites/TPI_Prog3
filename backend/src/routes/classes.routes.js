import { Router } from 'express';
import {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
} from '../controllers/classController.js';

const router = Router();

router.get('/classes', getAllClasses);
router.get('/classes/:id', getClassById);
router.post('/classes', createClass);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);

export default router;