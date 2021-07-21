const express = require('express');
const router = express.Router();

// Importing walletcontroller:
const walletController = require('../controllers/wallet.controller')

// To check if merchant is present or not:
const checkLogin = require('../Middlewares/merchant_auth')

// Find all wallet of a particular merchant from wallet Table:
// Each merchant has namely 3 wallets: revenue, budget and escrow:
// We have to basically find these 3 wallets information.
router.get('/merchant',checkLogin.merchantLogin,walletController.merchant_get);

// creditBudget: 
router.post('/:walletId/credit',checkLogin.merchantLogin,walletController.creditBudget)

module.exports = router;
