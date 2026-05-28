/**
 * Socket.io — Leaderboard real-time yangilash
 */
const db = require('../config/db');

function setupLeaderboardSocket(io) {
  const leaderboardNamespace = io.of('/leaderboard');

  leaderboardNamespace.on('connection', (socket) => {
    console.log(`[SOCKET] Leaderboard ulanish: ${socket.id}`);

    // Boshlang'ich leaderboard yuborish
    sendLeaderboard(socket);

    socket.on('disconnect', () => {
      console.log(`[SOCKET] Leaderboard uzilish: ${socket.id}`);
    });
  });

  return leaderboardNamespace;
}

/**
 * Leaderboard ma'lumotlarini yuborish
 */
async function sendLeaderboard(socket) {
  try {
    const leaders = await db('users')
      .where('is_banned', false)
      .where('role', 'user')
      .orderBy('score', 'desc')
      .limit(100)
      .select('id', 'full_name', 'username', 'score');

    const leaderboard = leaders.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    socket.emit('leaderboard:update', leaderboard);
  } catch (error) {
    console.error('[SOCKET] Leaderboard xatolik:', error.message);
  }
}

module.exports = { setupLeaderboardSocket };
