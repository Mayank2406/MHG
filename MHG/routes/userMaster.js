const express = require('express');
const router = express.Router();

const userMaster = require('../controllers/userMasterController');
const checkLogin   = require('../Middlewares/merchant_auth')

// GET api:
router.get('/', userMaster.master_get);

// Balance api:
router.get('/:userId/balance',userMaster.balance_get);

// Debit api:
router.post('/:userId/debit',checkLogin,userMaster.debit)


module.exports = router;