/**
 * Task Controller
 *
 * Foydalanuvchilar uchun: faol topshiriqlarni ko'rish va javob yuborish
 */
const db = require('../config/db');
const { TASK_STATUS } = require('shared');

/**
 * GET /api/tasks
 * Faol topshiriqlar ro'yxati
 * Har bir topshiriq uchun foydalanuvchining statusi ham qaytariladi
 */
async function listTasks(req, res) {
  try {
    const now = new Date();

    const tasks = await db('tasks')
      .where('is_active', true)
      .where(function () {
        this.whereNull('starts_at').orWhere('starts_at', '<=', now);
      })
      .where(function () {
        this.whereNull('expires_at').orWhere('expires_at', '>', now);
      })
      .orderBy('created_at', 'desc');

    // Foydalanuvchining har bir topshiriqdagi statusi
    const userTasks = await db('user_tasks')
      .where('user_id', req.user.userId)
      .select('task_id', 'status', 'completed_at');

    const userTaskMap = {};
    userTasks.forEach((ut) => {
      userTaskMap[ut.task_id] = { status: ut.status, completed_at: ut.completed_at };
    });

    const result = tasks.map((task) => ({
      ...task,
      user_status: userTaskMap[task.id] || null,
    }));

    res.json({ tasks: result });
  } catch (error) {
    console.error('[TASK] List xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * POST /api/tasks/:id/submit
 * Topshiriqqa javob yuborish (proof)
 * Body: { proof: { text: "...", image_url: "..." } }
 */
async function submitTask(req, res) {
  try {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.userId;
    const { proof } = req.body;

    // Topshiriq borligini va faolligini tekshirish
    const task = await db('tasks').where('id', taskId).where('is_active', true).first();
    if (!task) {
      return res.status(404).json({ error: 'Topshiriq topilmadi yoki faol emas.' });
    }

    // Muddati tekshirish
    const now = new Date();
    if (task.expires_at && new Date(task.expires_at) < now) {
      return res.status(400).json({ error: 'Topshiriq muddati tugagan.' });
    }

    // Allaqachon yuborilganmi tekshirish
    const existing = await db('user_tasks')
      .where('user_id', userId)
      .where('task_id', taskId)
      .first();

    if (existing) {
      return res.status(409).json({
        error: 'Bu topshiriqqa allaqachon javob yuborgansiz.',
        status: existing.status,
      });
    }

    // Javobni saqlash
    const [userTask] = await db('user_tasks')
      .insert({
        user_id: userId,
        task_id: taskId,
        status: TASK_STATUS.SUBMITTED,
        proof: proof ? JSON.stringify(proof) : null,
      })
      .returning('*');

    res.status(201).json({
      message: 'Javob muvaffaqiyatli yuborildi. Tekshirish kutilmoqda.',
      user_task: userTask,
    });
  } catch (error) {
    console.error('[TASK] Submit xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

module.exports = { listTasks, submitTask };
