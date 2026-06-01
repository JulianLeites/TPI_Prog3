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