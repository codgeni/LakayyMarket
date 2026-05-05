const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const db = require('../db');

// public: list products
router.get('/', async (req, res) => {
    await db.read();
    res.json(db.data.products || []);
});

// create new product (seller must be authenticated)
router.post('/', authenticate, async (req, res) => {
    const { title, price, description, category, image } = req.body;
    const user = req.user;
    await db.read();
    // verify user is a seller or convert automatically
    let seller = db.data.sellers.find(s=>s.email===user.email);
    if(!seller) {
        seller = { id: Date.now().toString(), name: user.name, email: user.email, region:'', category:'', banned:false };
        db.data.sellers.push(seller);
    }
    const product = { id: Date.now().toString(), sellerId: seller.id, sellerName: seller.name, title, price, description, category, image, createdAt: new Date().toISOString() };
    db.data.products.push(product);
    await db.write();
    res.json(product);
});

module.exports = router;