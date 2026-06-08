import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    getUserProfile
} from '../controllers/userController.js';

const router = Router();

// Define your user-related routes here
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/register', createUser);
router.post('/login', loginUser);

router.get('/verify', verifyToken, (req, res) => {
    return res.status(200).json({
        message: 'Token valido y verificado',
        user: req.user
    })
})

router.get('/profile', verifyToken, getUserProfile)

router.put('/profile', verifyToken, updateUser);
router.delete('/users/:id', verifyToken, deleteUser);

export default router;