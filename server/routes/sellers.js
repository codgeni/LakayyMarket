const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const db = require('../db');

// get all sellers (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
    await db.read();
    res.json(db.data.sellers || []);
});

// ban/unban seller
router.post('/:id/ban', authenticate, requireAdmin, async (req, res) => {
    await db.read();
    const seller = db.data.sellers.find(s=>String(s.id)===String(req.params.id));
    if(!seller) return res.status(404).json({error:'Not found'});
    seller.banned = !seller.banned;
    seller.banReason = req.body.reason || seller.banReason;
    await db.write();
    res.json(seller);
});

// delete seller
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    await db.read();
    db.data.sellers = db.data.sellers.filter(s=>String(s.id)!==String(req.params.id));
    // remove their products too
    db.data.products = db.data.products.filter(p=>String(p.sellerId)!==String(req.params.id));
    await db.write();
    res.json({ok:true});
});

module.exports = router;