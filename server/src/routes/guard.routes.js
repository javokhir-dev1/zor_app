const { Router } = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const { verifyQR } = require('../controllers/guard.controller');

const router = Router();

// POST /api/guard/verify-qr — QR-kodni tekshirish (guard + admin)
router.post('/verify-qr', auth, requireRole('guard', 'admin'), verifyQR);

module.exports = router;
