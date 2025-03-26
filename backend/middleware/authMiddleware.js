const jwt = require('jsonwebtoken');

const JWT_SECRET = '86e07bbabe39d8c431f11bdc75be3b12f01ed3f0d9d691969b839fb200f358dea7bb16082424520a11ec78436b6e3e56b414cf8030ede879315e2d1c66e6fd16';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // ✅ Attach user info to request
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
