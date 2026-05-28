/**
 * Zo'r TV Fan Club — Umumiy konstantalar
 * Bot, Server va Client tomonlarida ishlatiladi
 */

// ==================== ROLLAR ====================
const ROLES = {
  USER: 'user',
  GUARD: 'guard',
  ADMIN: 'admin',
};

const ALL_ROLES = Object.values(ROLES);

// ==================== TOPSHIRIQ STATUSLARI ====================
const TASK_STATUS = {
  PENDING: 'pending',       // Topshiriq qabul qilingan, hali bajarilmagan
  SUBMITTED: 'submitted',   // Foydalanuvchi javob yuborgan, tekshirish kutilmoqda
  APPROVED: 'approved',     // Admin tasdiqlagan
  REJECTED: 'rejected',     // Admin rad etgan
};

// ==================== TOPSHIRIQ TURLARI ====================
const TASK_TYPE = {
  DAILY: 'daily',           // Har kunlik
  WEEKLY: 'weekly',         // Haftalik
  ONE_TIME: 'one_time',     // Bir martalik
  SPECIAL: 'special',       // Maxsus
};

// ==================== CHIPTA STATUSLARI ====================
const TICKET_STATUS = {
  BOOKED: 'booked',         // Band qilingan
  CONFIRMED: 'confirmed',   // Admin tasdiqlagan (QR yuborilgan)
  CANCELLED: 'cancelled',   // Bekor qilingan
  USED: 'used',             // Ishlatilgan (Guard skanerlagan)
};

// ==================== SOZLAMA KALITLARI ====================
const SETTING_KEYS = {
  LIVE_TV_URL: 'live_tv_url',
  RADIO_URL: 'radio_url',
};

// ==================== JWT ====================
const JWT_EXPIRES_IN = '24h';
const INIT_DATA_MAX_AGE_SECONDS = 86400; // 24 soat (development uchun keng)

module.exports = {
  ROLES,
  ALL_ROLES,
  TASK_STATUS,
  TASK_TYPE,
  TICKET_STATUS,
  SETTING_KEYS,
  JWT_EXPIRES_IN,
  INIT_DATA_MAX_AGE_SECONDS,
};
