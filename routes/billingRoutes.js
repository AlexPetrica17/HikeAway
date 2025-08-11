const express = require('express');
const billingController = require('../controllers/billingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/invoice/:bookingId',
  authController.protect,
  billingController.generateInvoice,
);

module.exports = router;
