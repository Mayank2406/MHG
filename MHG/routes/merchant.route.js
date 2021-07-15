const express = require('express');
const router = express.Router();
const checkLogin = require('../Middlewares/merchant_auth')
const merchantController = require('../controllers/Merchant.controller')

//   settlement API:
//   /merchants/settle/escrow ->  Escrow to Revenue -> transaction in wallet History Table.
//   /merchants/settle/revene ->  Revenue to Budget -> transaction in wallet History Table.

router.post('/settle/escrow',checkLogin.merchantLogin,merchantController.settleEscrow);
router.post('/settle/revenue',checkLogin.merchantLogin,merchantController.settleRevenue);

module.exports = router;