const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const JWT_SECRET = '86e07bbabe39d8c431f11bdc75be3b12f01ed3f0d9d691969b839fb200f358dea7bb16082424520a11ec78436b6e3e56b414cf8030ede879315e2d1c66e6fd16';

// ✅ Register User
router.post('/register', async (req, res) => {
    const { name, email, phone, password, userType } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, phone, password: hashedPassword, userType });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, userType: newUser.userType },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token, userType: newUser.userType });
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, userType: user.userType });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Get Profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Profile Fetch Error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;




// // ✅ Logout (Handled on frontend by clearing token)
// router.post('/logout', (req, res) => {
//     res.status(200).json({ message: 'Logged out successfully' });
// });

// module.exports = router;
