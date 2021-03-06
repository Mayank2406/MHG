const express = require('express');
const router = express.Router();

const userMaster = require('../controllers/userMaster.controller');
const checkLogin = require('../Middlewares/merchant_auth')


// GET api:
router.get('/', userMaster.master_get);

// Balance api:
router.get('/:userId/:merchantId/balance', checkLogin.merchantLogin, userMaster.balance_get);

// Debit api:
router.post('/:userId/:merchantId/debit', checkLogin.merchantLogin, userMaster.debit);

// Credit api:
router.post('/:userId/:merchantId/credit', checkLogin.merchantLogin, userMaster.credit);

// Rank api:
router.get('/:userId/:merchantId/rank',userMaster.rank_get);

// Order_History api: This is wrt to user. 
// There is also 1 more API History Points that is same as this api but it is wrt merchant.
router.get('/:userId/order',userMaster.order_get);

// coins summary api: 
router.get('/:merchantId/coins',checkLogin.merchantLogin,userMaster.coins_get);

// checkOrder api: Check if the order exists or not:
router.get('/:orderId/checkOrder',userMaster.checkOrder);

module.exports = router;