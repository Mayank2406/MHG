const express = require('express');
const router = express.Router();

// Importing walletcontroller:
const walletController = require('../controllers/wallet.controller')


router.get('/', walletController.wallet_get);

module.exports = router;
