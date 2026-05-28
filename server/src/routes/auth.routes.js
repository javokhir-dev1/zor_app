const { Router } = require('express');
const { authenticate } = require('../controllers/auth.controller');

const router = Router();

// POST /api/auth — Telegram initData bilan avtorizatsiya
router.post('/', authenticate);

module.exports = router;
