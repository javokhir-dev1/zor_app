/**
 * User Controller
 *
 * Oddiy foydalanuvchi uchun: profil, leaderboard
 */
const db = require('../config/db');

/**
 * GET /api/user/profile
 * O'z profilini ko'rish
 */
async function getProfile(req, res) {
  try {
    const user = await db('users')
      .where('id', req.user.userId)
      .select('id', 'telegram_id', 'full_name', 'username', 'phone', 'role', 'score', 'registered_at')
      .first();

    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });
    }

    // Reytingdagi o'rnini hisoblash
    const rankResult = await db('users')
      .where('score', '>', user.score)
      .count('id as count')
      .first();

    const rank = parseInt(rankResult.count, 10) + 1;

    res.json({ ...user, rank });
  } catch (error) {
    console.error('[USER] Profile xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * GET /api/user/leaderboard
 * Top-100 reyting
 * Query params: ?limit=100
 */
async function getLeaderboard(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 100);

    const leaders = await db('users')
      .where('is_banned', false)
      .where('role', 'user')
      .orderBy('score', 'desc')
      .limit(limit)
      .select('id', 'full_name', 'username', 'score');

    // Rank qo'shish
    const leaderboard = leaders.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('[USER] Leaderboard xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

module.exports = { getProfile, getLeaderboard };
