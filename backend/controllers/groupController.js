const Group = require('../models/group');

// Create a new group
const createGroup = async (req, res) => {
    const { name, users } = req.body;

    if (!name || !users || users.length < 2) {
        return res.status(400).json({ message: 'Group name and at least 2 users are required.' });
    }

    try {
        const group = await Group.create({
            name,
            users,
            admin: req.user._id,
        });

        const populatedGroup = await group.populate('users', 'name email').populate('admin', 'name email').execPopulate();

        res.status(201).json(populatedGroup);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create group chat.', error: error.message });
    }
};

// Add a user to the group
const addToGroup = async (req, res) => {
    const { groupId, userId } = req.body;

    try {
        const group = await Group.findByIdAndUpdate(
            groupId,
            { $push: { users: userId } },
            { new: true }
        ).populate('users', 'name email').populate('admin', 'name email');

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add user to group.', error: error.message });
    }
};

// Remove a user from the group
const removeFromGroup = async (req, res) => {
    const { groupId, userId } = req.body;

    try {
        const group = await Group.findByIdAndUpdate(
            groupId,
            { $pull: { users: userId } },
            { new: true }
        ).populate('users', 'name email').populate('admin', 'name email');

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove user from group.', error: error.message });
    }
};

module.exports = { createGroup, addToGroup, removeFromGroup };