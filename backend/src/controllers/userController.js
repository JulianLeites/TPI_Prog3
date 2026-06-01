import { User } from '../models/Users.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};

export const createUser = async (req, res) => {
    const { name, username, password, email } = req.body;
    try {
        const newUser = await User.create({
            name,
            username,
            password,
            email
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, username, password, email } = req.body;
    try {
        const user = await User.findByPk(id);
        if (user) {
            user.name = name || user.name;
            user.username = username || user.username;
            user.password = password || user.password;
            user.email = email || user.email;
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};