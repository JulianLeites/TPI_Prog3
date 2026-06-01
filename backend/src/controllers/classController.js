import { Class } from '../models/Classes.js';

export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll();
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve classes' });
    }
};

export const getClassById = async (req, res) => {
    const { id } = req.params;
    try {
        const classes = await Class.findByPk(id);
        if (classes) {
            res.json(classes);
        } else {
            res.status(404).json({ error: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve class' });
    }
};

export const createClass = async (req, res) => {
    const { name, teacher_id, capacity, schedule, description } = req.body;

    if (!name || !teacher_id || !capacity || !schedule) {
        return res.status(400).json({ error: 'Name, teacher_id, capacity, and schedule are required' });
    }
    if (name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long' });
    }
    if (capacity <= 0) {
        return res.status(400).json({ error: 'Capacity must be a positive number' });
    }
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(schedule)) {
        return res.status(400).json({ error: 'Invalid schedule format. Please use YYYY-MM-DD HH:MM' });
    }
    if(description && description.length > 500) {
        return res.status(400).json({ error: 'Description must be less than 500 characters long' });
    }

    try {
        const newClass = await Class.create({
            name,
            teacher_id,
            capacity,
            schedule,
            description
        });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create class' });
    }
};

export const updateClass = async (req, res) => {
    const { id } = req.params;
    const { name, teacher_id, capacity, schedule, description } = req.body;

    if (name && name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long' });
    }
    if (capacity && capacity <= 0) {
        return res.status(400).json({ error: 'Capacity must be a positive number' });
    }
    if (schedule && !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(schedule)) {
        return res.status(400).json({ error: 'Invalid schedule format. Please use YYYY-MM-DD HH:MM' });
    }
    if (teacher_id && teacher_id <= 0) {
        return res.status(400).json({ error: 'Teacher ID must be a positive number' });
    }
    if (description && description.length > 500) {
        return res.status(400).json({ error: 'Description must be less than 500 characters long' });
    }

    try {
        const classes = await Class.findByPk(id);
        if (classes) {
            classes.name = name || classes.name;
            classes.teacher_id = teacher_id || classes.teacher_id;
            classes.capacity = capacity || classes.capacity;
            classes.schedule = schedule || classes.schedule;
            classes.description = description || classes.description;
            await classes.save();
            res.json(classes);
        } else {
            res.status(404).json({ error: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update class' });
    }
};

export const deleteClass = async (req, res) => {
    const { id } = req.params;
    try {
        const classes = await Class.findByPk(id);
        if (classes) {
            await classes.destroy();
            res.json({ message: 'Class deleted successfully' });
        } else {
            res.status(404).json({ error: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete class' });
    }
};