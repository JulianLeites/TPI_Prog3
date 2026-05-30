import { Router } from 'express';
import { User } from '../models/users.js';

const router = Router();

// Define your user-related routes here
router.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.json(user);
});

router.post('/users', (req, res) => {
    res.send('Create a new user');
});

router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Update user with ID: ${userId}`);
});

router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Delete user with ID: ${userId}`);
});

export default router;