const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const db = require('../db');
const { SECRET } = require('../middleware/auth');

// environment vars
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// helper to issue token
function issueToken(user) {
    const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin || false };
    return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

// register with email/password
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });
    await db.read();
    let existing = db.data.users.find(u => u.email === email);
    if (existing) return res.status(409).json({ error: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), name, email, password: hash, isAdmin: false };
    db.data.users.push(user);
    await db.write();
    const token = issueToken(user);
    res.json({ token, user: { id: user.id, name, email } });
});

// login with email/password
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });
    await db.read();
    const user = db.data.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = issueToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email } });
});

// google oauth token exchange
router.post('/google', async (req, res) => {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ error: 'id_token required' });
    let ticket;
    try {
        ticket = await client.verifyIdToken({ idToken: id_token, audience: GOOGLE_CLIENT_ID });
    } catch (e) {
        return res.status(401).json({ error: 'Invalid Google token' });
    }
    const payload = ticket.getPayload();
    const email = payload.email;
    await db.read();
    let user = db.data.users.find(u => u.email === email);
    if (!user) {
        user = { id: Date.now().toString(), name: payload.name || '', email, password: null, isAdmin: false };
        db.data.users.push(user);
        await db.write();
    }
    const token = issueToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email } });
});

module.exports = router;