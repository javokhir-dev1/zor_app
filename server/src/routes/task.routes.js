const { Router } = require('express');
const auth = require('../middleware/auth');
const { uploadProofs } = require('../middleware/upload');
const { listTasks, submitTask } = require('../controllers/task.controller');

const router = Router();

// GET /api/tasks — Faol topshiriqlar ro'yxati
router.get('/', auth, listTasks);

// POST /api/tasks/:id/submit — Topshiriqqa javob yuborish (matn + rasmlar)
router.post('/:id/submit', auth, uploadProofs.array('images', 5), submitTask);

module.exports = router;
