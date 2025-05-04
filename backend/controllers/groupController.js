const Group = require('../models/group');
const User = require('../models/User');

// Create a new group using usernames
const createGroup = async (req, res) => {
    const { name, users } = req.body;

    // Validate input
    if (!name || !users || users.length < 2) {
        return res.status(400).json({ message: 'Group name and at least 2 usernames are required.' });
    }

    try {
        // 🔍 Find users by their usernames
        const foundUsers = await User.find({ username: { $in: users } });

        if (foundUsers.length < 2) {
            return res.status(400).json({ message: 'At least 2 valid usernames are required.' });
        }

        const userIds = foundUsers.map(user => user._id);

        // 👤 Add group admin (logged-in user)
        const group = await Group.create({
            name,
            users: userIds,
            admin: req.user._id,
        });

        const populatedGroup = await group
            .populate('users', 'name email username')
            .populate('admin', 'name email username');

        res.status(201).json(populatedGroup);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create group chat.', error: error.message });
    }
};

const addToGroup = async (req, res) => {
    const { groupId, userId } = req.body;

    try {
        const group = await Group.findByIdAndUpdate(
            groupId,
            { $push: { users: userId } },
            { new: true }
        ).populate('users', 'name email username').populate('admin', 'name email username');

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add user to group.', error: error.message });
    }
};

const removeFromGroup = async (req, res) => {
    const { groupId, userId } = req.body;

    try {
        const group = await Group.findByIdAndUpdate(
            groupId,
            { $pull: { users: userId } },
            { new: true }
        ).populate('users', 'name email username').populate('admin', 'name email username');

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove user from group.', error: error.message });
    }
};

module.exports = { createGroup, addToGroup, removeFromGroup };
