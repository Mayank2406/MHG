const express = require('express');
const router = express.Router();
const merchantRoutes = require('../controllers/Merchant.controller')


// GET:
router.get('/', merchantRoutes.merchant_get);


// POST:
router.post('/', merchantRoutes.merchant_post);

module.exports = router;