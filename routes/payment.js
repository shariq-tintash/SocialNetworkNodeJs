const express = require('express');
const payment = require('../controllers/payment');

const router = express.Router();

// POST /payment
router.post(
    '',
    payment.addPayment
    );

module.exports = router;    