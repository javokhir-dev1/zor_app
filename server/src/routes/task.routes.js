const { Router } = require('express');
const auth = require('../middleware/auth');
const { listTasks, submitTask } = require('../controllers/task.controller');

const router = Router();

// GET /api/tasks — Faol topshiriqlar ro'yxati
router.get('/', auth, listTasks);

// POST /api/tasks/:id/submit — Topshiriqqa javob yuborish
router.post('/:id/submit', auth, submitTask);

module.exports = router;
