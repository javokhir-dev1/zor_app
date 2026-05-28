/**
 * RBAC (Role-Based Access Control) middleware
 *
 * Faqat ruxsat berilgan rollar kirishi mumkin.
 * authMiddleware'dan keyin ishlatiladi (req.user.role kerak).
 *
 * Foydalanish:
 *   router.get('/admin/users', auth, requireRole('admin'), controller.list);
 *   router.post('/guard/verify', auth, requireRole('admin', 'guard'), controller.verify);
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Avtorizatsiya talab qilinadi.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Ruxsat yo\'q. Sizning rolingiz bu amalni bajara olmaydi.' });
    }

    next();
  };
}

module.exports = requireRole;
