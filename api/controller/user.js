const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');




const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function sanitizeUser(userDoc) {
    if (!userDoc) return null;
    const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
    delete user.password;
    return user;
}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required.' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: 'Email already in use.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email: email.toLowerCase(),
            password: hashed,
        });

        await user.save();

        return res.status(201).json({ user: sanitizeUser(user) });
    } catch (err) {
        console.error('register error', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const payload = { id: user._id };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return res.json({ token, user: sanitizeUser(user) });
    } catch (err) {
        console.error('login error', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'User id is required.' });

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        return res.json({ user: sanitizeUser(user) });
    } catch (err) {
        console.error('getUser error', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).limit(100);
        return res.json({ users: users.map(sanitizeUser) });
    } catch (err) {
        console.error('getAllUsers error', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = { ...(req.body || {}) };

        if (!id) return res.status(400).json({ message: 'User id is required.' });

        // If password being updated, hash it
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        } else {
            delete updates.password;
        }

        // Prevent updating protected fields
        delete updates.createdAt;
        delete updates._id;

        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        return res.json({ user: sanitizeUser(user) });
    } catch (err) {
        console.error('updateUser error', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'User id is required.' });

        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        return res.json({ message: 'User deleted.' });
    } catch (err) {
        console.error('deleteUser error', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};  