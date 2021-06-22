const express = require('express');
const router = express.Router();

const userMaster = require('../controllers/userMasterController');

// GET api:
router.get('/', userMaster.master_get);

// Balance api:
router.get('/:userId/balance',userMaster.balance_get);



module.exports = router;