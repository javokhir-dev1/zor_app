const { Router } = require('express');
const auth = require('../middleware/auth');
const { listShows, bookShow } = require('../controllers/show.controller');

const router = Router();

// GET /api/shows — Faol ko'rsatuvlar
router.get('/', auth, listShows);

// POST /api/shows/:id/book — Joy band qilish
router.post('/:id/book', auth, bookShow);

module.exports = router;
