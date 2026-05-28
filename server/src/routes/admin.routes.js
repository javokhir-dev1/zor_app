const { Router } = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const validate = require('../middleware/validate');
const admin = require('../controllers/admin.controller');

const router = Router();

// Barcha admin route'lar auth + admin role talab qiladi
router.use(auth, requireRole('admin'));

// ==================== DASHBOARD ====================
router.get('/dashboard', admin.getDashboard);

// ==================== FOYDALANUVCHILAR ====================
router.get('/users', admin.listUsers);
router.patch('/users/:id/role', validate(['role']), admin.updateUserRole);
router.patch('/users/:id/ban', admin.toggleBan);
router.patch('/users/:id/score', validate(['amount']), admin.updateScore);

// ==================== XODIMLAR ====================
router.get('/staff', admin.listStaff);

// ==================== TOPSHIRIQLAR ====================
router.post('/tasks', validate(['title', 'type', 'reward_points']), admin.createTask);
router.put('/tasks/:id', admin.updateTask);
router.delete('/tasks/:id', admin.deleteTask);

// ==================== ISBOTLAR ====================
router.get('/submissions', admin.listSubmissions);
router.patch('/submissions/:id', validate(['status']), admin.reviewSubmission);

// ==================== KO'RSATUVLAR ====================
router.get('/shows', admin.listShowsAdmin);
router.post('/shows', validate(['title', 'show_date', 'total_seats']), admin.createShow);
router.put('/shows/:id', admin.updateShow);
router.get('/shows/:id/tickets', admin.listShowTickets);

// ==================== CHIPTALAR ====================
router.patch('/tickets/:id/confirm', admin.confirmTicket);

// ==================== MAILING ====================
router.post('/mailing', validate(['message']), admin.sendMailing);

module.exports = router;
