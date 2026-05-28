const { Router } = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const { getStreamUrls, getAllSettings, updateSetting } = require('../controllers/settings.controller');

const router = Router();

// GET /api/settings/stream-urls — TV va Radio URL (hammaga)
router.get('/stream-urls', auth, getStreamUrls);

// GET /api/settings/all — Barcha sozlamalar (admin)
router.get('/all', auth, requireRole('admin'), getAllSettings);

// PUT /api/settings — Sozlamani yangilash (admin)
router.put('/', auth, requireRole('admin'), updateSetting);

module.exports = router;
