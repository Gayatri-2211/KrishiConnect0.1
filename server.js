const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./backend/routes/productRoutes');
const authRoutes = require('./backend/routes/authRoutes'); // Added auth routes

const app = express();

// ✅ Middleware
app.use(cors({
    origin: '*', // Allow requests from all origins (can restrict to specific domains)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// ✅ MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/kirshi';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1); // Stop the server if DB connection fails
    });

// ✅ Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // Register auth routes

// ✅ Test Route
app.get('/', (req, res) => {
    res.send('🌾 Krishi API is running...');
});

// ✅ Global Error Handling (Optional)
app.use((err, req, res, next) => {
    console.error('❌ Global Error:', err.message);
    res.status(500).json({ error: '❌ Something went wrong' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

