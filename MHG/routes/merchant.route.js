const express = require('express');
const router = express.Router();
const checkLogin = require('../Middlewares/merchant_auth')
const merchantController = require('../controllers/Merchant.controller')

//   settlement API:
//   /merchants/settle/escrow ->  Escrow to Revenue -> transaction in wallet History Table.
//   /merchants/settle/revene ->  Revenue to Budget -> transaction in wallet History Table.

router.post('/settle/:merchantId/:wallet_type',checkLogin.merchantLogin,merchantController.settlement);

router.get('/:merchantId/transactionSummary',checkLogin.merchantLogin,merchantController.getTransactionSummary)

// This is from UserHistory Collection/Table 
router.get('/:merchantId/historyPoints',checkLogin.merchantLogin,merchantController.getHistoryPoints)

// This is from WalletHistory Collection/Table
router.get('/:merchantId/walletHistoryPoints',checkLogin.merchantLogin,merchantController.getWalletHistoryPoints)

module.exports = router;