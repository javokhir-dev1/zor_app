/**
 * Admin Controller
 *
 * Tizimni to'liq boshqarish: dashboard, userlar, rollar, topshiriqlar,
 * isbotlar, ko'rsatuvlar, chiptalar, mailing
 */
const db = require('../config/db');
const env = require('../config/env');
const { ROLES, TASK_STATUS, TICKET_STATUS } = require('shared');

// ==================== DASHBOARD ====================

/**
 * GET /api/admin/dashboard
 */
async function getDashboard(req, res) {
  try {
    const [totalUsers] = await db('users').count('id as count');
    const [todayUsers] = await db('users')
      .whereRaw("registered_at >= CURRENT_DATE")
      .count('id as count');
    const [totalTasks] = await db('tasks').where('is_active', true).count('id as count');
    const [pendingSubmissions] = await db('user_tasks')
      .where('status', TASK_STATUS.SUBMITTED)
      .count('id as count');
    const [activeShows] = await db('shows')
      .where('is_active', true)
      .where('show_date', '>', new Date())
      .count('id as count');
    const [pendingTickets] = await db('tickets')
      .where('status', TICKET_STATUS.BOOKED)
      .count('id as count');

    // Oxirgi 7 kunlik ro'yxatdan o'tish statistikasi
    const weeklyStats = await db('users')
      .select(db.raw("DATE(registered_at) as date"))
      .count('id as count')
      .whereRaw("registered_at >= CURRENT_DATE - INTERVAL '7 days'")
      .groupByRaw("DATE(registered_at)")
      .orderBy('date', 'asc');

    res.json({
      total_users: parseInt(totalUsers.count, 10),
      today_users: parseInt(todayUsers.count, 10),
      active_tasks: parseInt(totalTasks.count, 10),
      pending_submissions: parseInt(pendingSubmissions.count, 10),
      active_shows: parseInt(activeShows.count, 10),
      pending_tickets: parseInt(pendingTickets.count, 10),
      weekly_registrations: weeklyStats,
    });
  } catch (error) {
    console.error('[ADMIN] Dashboard xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

// ==================== FOYDALANUVCHILAR ====================

/**
 * GET /api/admin/users
 * Query: ?page=1&limit=20&search=ism&role=user
 */
async function listUsers(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const roleFilter = req.query.role || '';

    let query = db('users');

    if (search) {
      query = query.where(function () {
        this.where('full_name', 'ilike', `%${search}%`)
          .orWhere('username', 'ilike', `%${search}%`)
          .orWhere('phone', 'ilike', `%${search}%`)
          .orWhere(db.raw('CAST(telegram_id AS TEXT)'), 'ilike', `%${search}%`);
      });
    }

    if (roleFilter) {
      query = query.where('role', roleFilter);
    }

    const [{ count: total }] = await query.clone().count('id as count');

    const users = await query
      .orderBy('registered_at', 'desc')
      .limit(limit)
      .offset(offset)
      .select('id', 'telegram_id', 'full_name', 'username', 'phone', 'role', 'score', 'is_banned', 'registered_at', 'last_active_at');

    res.json({
      users,
      pagination: {
        page,
        limit,
        total: parseInt(total, 10),
        total_pages: Math.ceil(parseInt(total, 10) / limit),
      },
    });
  } catch (error) {
    console.error('[ADMIN] Users xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * PATCH /api/admin/users/:id/role
 * Body: { role: "admin" | "guard" | "user" }
 */
async function updateUserRole(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const { role } = req.body;

    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ error: 'Yaroqsiz rol. Faqat: user, guard, admin.' });
    }

    const user = await db('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });
    }

    // Super adminni o'zgartirish mumkin emas
    if (env.adminId && user.telegram_id === env.adminId) {
      return res.status(403).json({ error: 'Asosiy admin rolini o\'zgartirish mumkin emas.' });
    }

    await db('users').where('id', userId).update({ role });

    res.json({ message: `Foydalanuvchi roli '${role}' ga o'zgartirildi.`, user_id: userId, role });
  } catch (error) {
    console.error('[ADMIN] Role xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * PATCH /api/admin/users/:id/ban
 * Body: { is_banned: true/false }
 */
async function toggleBan(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const { is_banned } = req.body;

    const user = await db('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });
    }

    // Super adminni ban qilish mumkin emas
    if (env.adminId && user.telegram_id === env.adminId) {
      return res.status(403).json({ error: 'Asosiy adminni ban qilish mumkin emas.' });
    }

    await db('users').where('id', userId).update({ is_banned: !!is_banned });

    const action = is_banned ? 'bloklandi' : 'blokdan chiqarildi';
    res.json({ message: `Foydalanuvchi ${action}.`, user_id: userId, is_banned: !!is_banned });
  } catch (error) {
    console.error('[ADMIN] Ban xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * PATCH /api/admin/users/:id/score
 * Body: { amount: 10 } (musbat = qo'shish, manfiy = ayirish)
 */
async function updateScore(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount === 0) {
      return res.status(400).json({ error: 'amount (son, 0 dan farqli) kerak.' });
    }

    const user = await db('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });
    }

    const newScore = Math.max(0, user.score + amount);
    await db('users').where('id', userId).update({ score: newScore });

    res.json({
      message: `Ball ${amount > 0 ? '+' : ''}${amount} o'zgartirildi.`,
      user_id: userId,
      old_score: user.score,
      new_score: newScore,
    });
  } catch (error) {
    console.error('[ADMIN] Score xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

// ==================== XODIMLAR ====================

/**
 * GET /api/admin/staff
 * Guard va admin ro'yxati
 */
async function listStaff(req, res) {
  try {
    const staff = await db('users')
      .whereIn('role', [ROLES.ADMIN, ROLES.GUARD])
      .orderBy('role', 'asc')
      .select('id', 'telegram_id', 'full_name', 'username', 'phone', 'role', 'registered_at');

    res.json({ staff });
  } catch (error) {
    console.error('[ADMIN] Staff xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

// ==================== TOPSHIRIQLAR CRUD ====================

/**
 * POST /api/admin/tasks
 */
async function createTask(req, res) {
  try {
    const { title, description, type, reward_points, meta, starts_at, expires_at } = req.body;

    const [task] = await db('tasks')
      .insert({
        title,
        description: description || null,
        type,
        reward_points,
        meta: meta ? JSON.stringify(meta) : null,
        starts_at: starts_at || null,
        expires_at: expires_at || null,
      })
      .returning('*');

    res.status(201).json({ message: 'Topshiriq yaratildi.', task });
  } catch (error) {
    console.error('[ADMIN] Task create xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * PUT /api/admin/tasks/:id
 */
async function updateTask(req, res) {
  try {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, type, reward_points, meta, is_active, starts_at, expires_at } = req.body;

    const task = await db('tasks').where('id', taskId).first();
    if (!task) {
      return res.status(404).json({ error: 'Topshiriq topilmadi.' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (reward_points !== undefined) updateData.reward_points = reward_points;
    if (meta !== undefined) updateData.meta = JSON.stringify(meta);
    if (is_active !== undefined) updateData.is_active = is_active;
    if (starts_at !== undefined) updateData.starts_at = starts_at;
    if (expires_at !== undefined) updateData.expires_at = expires_at;

    await db('tasks').where('id', taskId).update(updateData);

    const updated = await db('tasks').where('id', taskId).first();
    res.json({ message: 'Topshiriq yangilandi.', task: updated });
  } catch (error) {
    console.error('[ADMIN] Task update xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * DELETE /api/admin/tasks/:id
 */
async function deleteTask(req, res) {
  try {
    const taskId = parseInt(req.params.id, 10);
    const deleted = await db('tasks').where('id', taskId).del();

    if (!deleted) {
      return res.status(404).json({ error: 'Topshiriq topilmadi.' });
    }

    res.json({ message: 'Topshiriq o\'chirildi.', task_id: taskId });
  } catch (error) {
    console.error('[ADMIN] Task delete xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

// ==================== ISBOTLAR ====================

/**
 * GET /api/admin/submissions
 * Query: ?status=submitted&page=1&limit=20
 */
async function listSubmissions(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const statusFilter = req.query.status || '';

    let query = db('user_tasks')
      .join('users', 'user_tasks.user_id', 'users.id')
      .join('tasks', 'user_tasks.task_id', 'tasks.id');

    if (statusFilter) {
      query = query.where('user_tasks.status', statusFilter);
    }

    const [{ count: total }] = await query.clone().count('user_tasks.id as count');

    const submissions = await query
      .orderBy('user_tasks.created_at', 'desc')
      .limit(limit)
      .offset(offset)
      .select(
        'user_tasks.id',
        'user_tasks.status',
        'user_tasks.proof',
        'user_tasks.created_at',
        'user_tasks.completed_at',
        'users.full_name as user_name',
        'users.telegram_id as user_telegram_id',
        'tasks.title as task_title',
        'tasks.reward_points'
      );

    res.json({
      submissions,
      pagination: {
        page,
        limit,
        total: parseInt(total, 10),
        total_pages: Math.ceil(parseInt(total, 10) / limit),
      },
    });
  } catch (error) {
    console.error('[ADMIN] Submissions xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * PATCH /api/admin/submissions/:id
 * Body: { status: "approved" | "rejected" }
 */
async function reviewSubmission(req, res) {
  try {
    const submissionId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (![TASK_STATUS.APPROVED, TASK_STATUS.REJECTED].includes(status)) {
      return res.status(400).json({ error: 'Status faqat approved yoki rejected bo\'lishi kerak.' });
    }

    const submission = await db('user_tasks').where('id', submissionId).first();
    if (!submission) {
      return res.status(404).json({ error: 'Yuborish topilmadi.' });
    }

    if (submission.status !== TASK_STATUS.SUBMITTED) {
      return res.status(400).json({ error: 'Faqat "submitted" statusdagi isbotlarni ko\'rib chiqish mumkin.' });
    }

    // Statusni yangilash
    await db('user_tasks').where('id', submissionId).update({
      status,
      completed_at: status === TASK_STATUS.APPROVED ? db.fn.now() : null,
    });

    // Agar tasdiqlansa — foydalanuvchiga ball qo'shish
    if (status === TASK_STATUS.APPROVED) {
      const task = await db('tasks').where('id', submission.task_id).first();
      if (task) {
        await db('users')
          .where('id', submission.user_id)
          .increment('score', task.reward_points);
      }
    }

    res.json({ message: `Isbot ${status === TASK_STATUS.APPROVED ? 'tasdiqlandi' : 'rad etildi'}.`, submission_id: submissionId });
  } catch (error) {
    console.error('[ADMIN] Review xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

// ==================== KO'RSATUVLAR ====================

/**
 * GET /api/admin/shows
 * Barcha ko'rsatuvlarni qaytaradi
 */
async function listShowsAdmin(req, res) {
  try {
    const shows = await db('shows').orderBy('show_date', 'desc');
    res.json({ shows });
  } catch (error) {
    console.error('[ADMIN] Shows list xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * POST /api/admin/shows
 */
async function createShow(req, res) {
  try {
    const { title, description, show_date, location, total_seats } = req.body;

    const [show] = await db('shows')
      .insert({
        title,
        description: description || null,
        show_date,
        location: location || null,
        total_seats,
        available_seats: total_seats,
      })
      .returning('*');

    res.status(201).json({ message: 'Ko\'rsatuv yaratildi.', show });
  } catch (error) {
    console.error('[ADMIN] Show create xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * PUT /api/admin/shows/:id
 */
async function updateShow(req, res) {
  try {
    const showId = parseInt(req.params.id, 10);
    const { title, description, show_date, location, total_seats, is_active } = req.body;

    const show = await db('shows').where('id', showId).first();
    if (!show) {
      return res.status(404).json({ error: 'Ko\'rsatuv topilmadi.' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (show_date !== undefined) updateData.show_date = show_date;
    if (location !== undefined) updateData.location = location;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (total_seats !== undefined) {
      const seatDiff = total_seats - show.total_seats;
      updateData.total_seats = total_seats;
      updateData.available_seats = Math.max(0, show.available_seats + seatDiff);
    }

    await db('shows').where('id', showId).update(updateData);

    const updated = await db('shows').where('id', showId).first();
    res.json({ message: 'Ko\'rsatuv yangilandi.', show: updated });
  } catch (error) {
    console.error('[ADMIN] Show update xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * GET /api/admin/shows/:id/tickets
 */
async function listShowTickets(req, res) {
  try {
    const showId = parseInt(req.params.id, 10);

    const tickets = await db('tickets')
      .join('users', 'tickets.user_id', 'users.id')
      .where('tickets.show_id', showId)
      .orderBy('tickets.booked_at', 'desc')
      .select(
        'tickets.id',
        'tickets.status',
        'tickets.qr_code',
        'tickets.booked_at',
        'tickets.confirmed_at',
        'users.full_name',
        'users.phone',
        'users.telegram_id'
      );

    res.json({ tickets });
  } catch (error) {
    console.error('[ADMIN] Show tickets xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * PATCH /api/admin/tickets/:id/confirm
 * Chiptani tasdiqlash — status = confirmed
 */
async function confirmTicket(req, res) {
  try {
    const ticketId = parseInt(req.params.id, 10);

    const ticket = await db('tickets').where('id', ticketId).first();
    if (!ticket) {
      return res.status(404).json({ error: 'Chipta topilmadi.' });
    }

    if (ticket.status !== TICKET_STATUS.BOOKED) {
      return res.status(400).json({ error: `Faqat "booked" statusdagi chiptalarni tasdiqlash mumkin. Hozirgi: ${ticket.status}` });
    }

    await db('tickets').where('id', ticketId).update({
      status: TICKET_STATUS.CONFIRMED,
      confirmed_at: db.fn.now(),
    });

    // Foydalanuvchi ma'lumoti (bot orqali QR yuborish uchun)
    const user = await db('users').where('id', ticket.user_id).first();
    const show = await db('shows').where('id', ticket.show_id).first();

    res.json({
      message: 'Chipta tasdiqlandi.',
      ticket_id: ticketId,
      qr_code: ticket.qr_code,
      user: { telegram_id: user.telegram_id, full_name: user.full_name },
      show: { title: show.title, show_date: show.show_date },
    });
  } catch (error) {
    console.error('[ADMIN] Confirm xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

// ==================== MAILING ====================

/**
 * POST /api/admin/mailing
 * Body: { message: "Xabar matni", segment: "all" | "top", top_limit: 100 }
 *
 * Hozircha xabar ma'lumotlarini qaytaradi.
 * Bot instance ulanganida real mailing ishlaydi.
 */
async function sendMailing(req, res) {
  try {
    const { message, segment, top_limit } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Xabar matni kerak.' });
    }

    let users;
    if (segment === 'top') {
      const limit = parseInt(top_limit, 10) || 100;
      users = await db('users')
        .where('is_banned', false)
        .orderBy('score', 'desc')
        .limit(limit)
        .select('telegram_id');
    } else {
      users = await db('users')
        .where('is_banned', false)
        .select('telegram_id');
    }

    const telegramIds = users.map((u) => u.telegram_id);

    // TODO: Bot instance orqali real mailing (3-5 bosqichda ulanadi)
    res.json({
      message: 'Mailing boshlandi.',
      total_recipients: telegramIds.length,
      segment: segment || 'all',
    });
  } catch (error) {
    console.error('[ADMIN] Mailing xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

module.exports = {
  getDashboard,
  listUsers,
  updateUserRole,
  toggleBan,
  updateScore,
  listStaff,
  createTask,
  updateTask,
  deleteTask,
  listSubmissions,
  reviewSubmission,
  listShowsAdmin,
  createShow,
  updateShow,
  listShowTickets,
  confirmTicket,
  sendMailing,
};
