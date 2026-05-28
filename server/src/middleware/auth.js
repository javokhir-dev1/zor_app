/**
 * JWT avtorizatsiya middleware
 *
 * Har bir himoyalangan so'rovda Authorization: Bearer <token> tekshiriladi.
 * Token yaroqli bo'lsa, req.user ga payload qo'shiladi.
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token topilmadi. Authorization header kerak.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded; // { userId, telegramId, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token muddati tugagan. Qayta avtorizatsiya qiling.' });
    }
    return res.status(401).json({ error: 'Token yaroqsiz.' });
  }
}

module.exports = authMiddleware;
