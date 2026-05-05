const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET = process.env.JWT_SECRET || 'replace_this_with_strong_secret';

function authenticate(req, res, next) {
    const auth = req.headers.authorization || '';
    const token = auth.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
        const payload = jwt.verify(token, SECRET);
        req.user = payload;
        next();
    } catch (e) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Auth required' });
    const user = db.data.users.find(u => u.id === req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin only' });
    next();
}

module.exports = { authenticate, requireAdmin, SECRET };
