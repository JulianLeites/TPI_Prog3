import { User } from '../models/Users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secretKey } from '../config.js';
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
    const { name, username, password, email, rol } = req.body;
    try {
        if (!name || !username || !password || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (name.length < 3) {
            return res.status(400).json({ error: 'Name must be at least 3 characters long' });
        }

        if (username.length < 4) {
            return res.status(400).json({ error: 'Username must be at least 4 characters long' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ where: { email } });

        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }  
            
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            username,
            password: hashedPassword,
            email,
            rol: rol
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};
export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ username: user.username, password: user.password, rol: user.rol }, secretKey, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login user' });
    }
};
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, username, password, email, rol } = req.body;
    try {
        const user = await User.findByPk(id);

        if(!user) {
            return res.status(400).json({ error: 'User Not Found' })
        }

        if (name && name.length < 3) {
            return res.status(400).json({ error: 'Name must be at least 3 characters long' });
        }

        if (username){
            if(username.length < 4) {
                return res.status(400).json({error: 'Username must be atleast 4 characters long'});
            }
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser && existingUser.id !== parseInt(id)) {
                return res.status(400).json({ error: 'Username already exists' });
            }
        }

        if (password && password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        if(email) {
            if (email && !/\S+@\S+\.\S+/.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail && existingEmail.id !== parseInt(id)) {
                return res.status(400).json({ error: 'Email already exists' });
            } 
        }

        
        user.name = name || user.name;
        user.username = username || user.username;
        user.password = password || user.password;
        user.email = email || user.email;
        user.rol = rol || user.rol;
        await user.save();
        res.json(user);
        
    } catch (error) {
        console.error("Backend Error: ", error);
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