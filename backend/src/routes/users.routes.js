import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
} from '../controllers/userController.js';

const router = Router();

// Define your user-related routes here
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/users/:id', verifyToken, updateUser);
router.delete('/users/:id', verifyToken, deleteUser);

export default router;