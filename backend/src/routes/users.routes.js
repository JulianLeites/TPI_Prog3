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

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/verify', verifyToken, (req, res) => {
    return res.status(200).json({
        message: 'Token valido y verificado',
        user: req.user
    })
})

router.get('/users', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getUserById);
router.put('/users/:id', verifyToken, updateUser);
router.delete('/users/:id', verifyToken, deleteUser);

router.get('/', verifyToken, getUserProfile)
router.get('/:id', verifyToken, getUserProfile)

export default router;