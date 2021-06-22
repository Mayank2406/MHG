const express = require('express');
const router = express.Router();

// Importing walletcontroller:
const walletController = require('../controllers/walletController')


router.get('/', walletController.wallet_get);

module.exports = router;
