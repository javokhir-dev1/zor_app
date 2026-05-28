/**
 * Socket.io asosiy sozlash
 */
const { Server } = require('socket.io');
const { setupLeaderboardSocket } = require('./leaderboard');

function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Leaderboard namespace
  const leaderboardNs = setupLeaderboardSocket(io);

  io.on('connection', (socket) => {
    console.log(`[SOCKET] Ulanish: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[SOCKET] Uzilish: ${socket.id}`);
    });
  });

  console.log('[SOCKET] Socket.io sozlandi.');

  return { io, leaderboardNs };
}

module.exports = setupSocket;
