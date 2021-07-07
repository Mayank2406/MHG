const express = require('express');
const router = express.Router();
const userHistoryRoutes = require('../controllers/UserHistory.controller');


// GET Route:
router.get('/', userHistoryRoutes.user_get)

// POST Route:
router.post('/', userHistoryRoutes.user_post)


module.exports = router;