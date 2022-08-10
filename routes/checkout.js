const express = require('express');
const payment = require('../controllers/payment');

const router = express.Router();

// GET /checkout
router.get('',payment.renderPage);

// POST /checkout/token
router.post(
    '/token',
    payment.logToken
    );

module.exports = router;    