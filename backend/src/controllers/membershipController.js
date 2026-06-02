import { Membership } from '../models/membership.js';

export const getAllMemberships = async (req, res) => {
    try {
        const memberships = await Membership.findAll();
        res.json(memberships);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve memberships' });
    }
};

export const getMembershipById = async (req, res) => {
    const { id } = req.params;
    try {
        const membership = await Membership.findByPk(id);
        if (membership) {
            res.json(membership);
        } else {
            res.status(404).json({ error: 'Membership not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve membership' });
    }
};

export const createMembership = async (req, res) => {
    const { name, price, duration, max_classes } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    if (name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long' });
    }
    if (price <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
    }
    if (duration && duration <= 0) {
        return res.status(400).json({ error: 'Duration must be a positive number' });
    }
    if (max_classes && max_classes <= 0) {
        return res.status(400).json({ error: 'Max classes must be a positive number' });
    }

    try {
        const newMembership = await Membership.create({
            name,
            price,
            duration_days: duration,
            max_classes: max_classes
        });
        res.status(201).json(newMembership);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create membership' });
    }
};

export const updateMembership = async (req, res) => {
    const { id } = req.params;
    const { name, price, duration, max_classes } = req.body;

    if (name && name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long' });
    }
    if (price && price <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
    }
    if (duration && duration <= 0) {
        return res.status(400).json({ error: 'Duration must be a positive number' });
    }
    if (max_classes && max_classes <= 0) {
        return res.status(400).json({ error: 'Max classes must be a positive number' });
    }

    try {
        const membership = await Membership.findByPk(id);
        if (membership) {
            membership.name = name || membership.name;
            membership.price = price || membership.price;
            membership.duration_days = duration || membership.duration_days;
            membership.max_classes = max_classes || membership.max_classes;
            await membership.save();
            res.json(membership);
        } else {
            res.status(404).json({ error: 'Membership not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update membership' });
    }
};

export const deleteMembership = async (req, res) => {
    const { id } = req.params;
    try {
        const membership = await Membership.findByPk(id);
        if (membership) {
            await membership.destroy();
            res.json({ message: 'Membership deleted successfully' });
        } else {
            res.status(404).json({ error: 'Membership not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete membership' });
    }
};