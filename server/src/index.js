/**
 * Zo'r TV Fan Club — Backend API Server
 *
 * Express.js + Socket.io
 * Barcha route'lar, middleware'lar va socket ulanishlari shu yerda birlashtirilgan.
 */
require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const setupSocket = require('./socket');

// Route fayllarini import qilish
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const showRoutes = require('./routes/show.routes');
const guardRoutes = require('./routes/guard.routes');
const adminRoutes = require('./routes/admin.routes');
const settingsRoutes = require('./routes/settings.routes');

// ==================== EXPRESS SOZLASH ====================

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (development uchun)
if (env.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ==================== ROUTE'LAR ====================

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/guard', guardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler (faqat API uchun)
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint topilmadi.' });
});

// ==================== CLIENT STATIC FILES ====================

const path = require('path');
const clientDistPath = path.join(__dirname, '../../client/dist');

// Client build fayllarini serve qilish
app.use(express.static(clientDistPath));

// SPA fallback — barcha boshqa route'lar uchun index.html qaytarish
// React Router (BrowserRouter) uchun zarur: /admin, /guard, /profile va boshqalar
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message);
  res.status(500).json({ error: 'Server xatoligi.' });
});

// ==================== SERVER ISHGA TUSHIRISH ====================

const server = http.createServer(app);

// Socket.io sozlash
const { io, leaderboardNs } = setupSocket(server);

// Socket instance'larini global qilish (boshqa fayllardan foydalanish uchun)
app.set('io', io);
app.set('leaderboardNs', leaderboardNs);

server.listen(env.port, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     📺  Zo\'r TV Fan Club API             ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  🌐 URL: http://localhost:${env.port}`);
  console.log(`║  📡 Environment: ${env.nodeEnv}`);
  console.log(`║  🔌 Socket.io: enabled`);
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  console.log('API Endpoints:');
  console.log('  POST   /api/auth              — Avtorizatsiya');
  console.log('  GET    /api/user/profile       — Profil');
  console.log('  GET    /api/user/leaderboard   — Reyting');
  console.log('  GET    /api/tasks              — Topshiriqlar');
  console.log('  POST   /api/tasks/:id/submit   — Javob yuborish');
  console.log('  GET    /api/shows              — Ko\'rsatuvlar');
  console.log('  POST   /api/shows/:id/book     — Joy band qilish');
  console.log('  POST   /api/guard/verify-qr    — QR tekshirish');
  console.log('  GET    /api/admin/dashboard     — Admin statistika');
  console.log('  GET    /api/settings/stream-urls — Stream URL\'lar');
  console.log('  GET    /api/health             — Health check');
  console.log('');
});

module.exports = { app, server };
