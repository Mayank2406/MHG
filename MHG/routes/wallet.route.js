const express = require('express');
const router = express.Router();

// Importing walletcontroller:
const walletController = require('../controllers/wallet.controller')

// To check if merchant is present or not:
const checkLogin = require('../Middlewares/merchant_auth')

// MerchantWallet API:
// Find all wallet of a particular merchant from wallet Table:
// Each merchant has namely 3 wallets: revenue, budget and escrow:
// We have to basically find these 3 wallets information.
router.get('/:merchantId',checkLogin.merchantLogin,walletController.merchant_get);

// creditBudget:  Credit Budget Wallet with credit points
router.post('/:merchantId/creditBudget',checkLogin.merchantLogin,walletController.creditBudget)

module.exports = router;
