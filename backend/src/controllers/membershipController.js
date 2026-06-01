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
    const { name, price, duration } = req.body;
    try {
        const newMembership = await Membership.create({
            name,
            price,
            duration_days: duration
        });
        res.status(201).json(newMembership);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create membership' });
    }
};

export const updateMembership = async (req, res) => {
    const { id } = req.params;
    const { name, price, duration } = req.body;
    try {
        const membership = await Membership.findByPk(id);
        if (membership) {
            membership.name = name || membership.name;
            membership.price = price || membership.price;
            membership.duration_days = duration || membership.duration_days;
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