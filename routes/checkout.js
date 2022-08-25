const express = require('express');
const payment = require('../controllers/payment');
const checkout = require('../controllers/checkout');
const router = express.Router();

// GET /checkout
router.get('',checkout.renderPage);

// POST /checkout/token
router.post(
    '/token',
    checkout.logToken
    );

module.exports = router;    