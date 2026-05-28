const { Router } = require('express');
const auth = require('../middleware/auth');
const { getProfile, getLeaderboard } = require('../controllers/user.controller');

const router = Router();

// GET /api/user/profile — O'z profilini ko'rish
router.get('/profile', auth, getProfile);

// GET /api/user/leaderboard — Top-100 reyting
router.get('/leaderboard', auth, getLeaderboard);

module.exports = router;
