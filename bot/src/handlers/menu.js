/**
 * Reply Keyboard menyu tugmalari handleri
 *
 * Foydalanuvchi pastdagi tugmalardan birini bosganda,
 * uning roliga qarab tegishli Web App inline tugmasini yuboradi.
 *
 * Tugmalar:
 * - "📺 Ilovani ochish"  → User Web App
 * - "⚙️ Admin Panel"     → Admin Web App
 * - "📷 QR Skaner"       → Guard QR Skaner Web App
 */
const db = require('../config/db');
const env = require('../config/env');
const { ROLES } = require('shared');
const {
  getWebAppButton,
  getAdminWebAppButton,
  getGuardWebAppButton,
} = require('../keyboards');

/**
 * "📺 Ilovani ochish" tugmasi bosilganda
 */
async function handleOpenApp(ctx) {
  const user = await getUser(ctx.from.id);
  if (!user) return askToRegister(ctx);
  if (user.is_banned) return showBanned(ctx);

  await ctx.reply(
    '📺 Zo\'r TV Fan Club ilovasini ochish uchun quyidagi tugmani bosing:',
    getWebAppButton(env.webAppUrl)
  );
}

/**
 * "⚙️ Admin Panel" tugmasi bosilganda
 */
async function handleAdminPanel(ctx) {
  const user = await getUser(ctx.from.id);
  if (!user) return askToRegister(ctx);
  if (user.is_banned) return showBanned(ctx);

  // Admin tekshiruvi
  if (user.role !== ROLES.ADMIN) {
    return ctx.reply('⛔ Sizda admin huquqi yo\'q.');
  }

  await ctx.reply(
    '⚙️ Admin panelni ochish uchun quyidagi tugmani bosing:',
    getAdminWebAppButton(env.webAppUrl)
  );
}

/**
 * "📷 QR Skaner" tugmasi bosilganda
 */
async function handleQRScanner(ctx) {
  const user = await getUser(ctx.from.id);
  if (!user) return askToRegister(ctx);
  if (user.is_banned) return showBanned(ctx);

  // Guard yoki Admin tekshiruvi
  if (user.role !== ROLES.GUARD && user.role !== ROLES.ADMIN) {
    return ctx.reply('⛔ Sizda skaner huquqi yo\'q.');
  }

  await ctx.reply(
    '📷 QR Skanerni ochish uchun quyidagi tugmani bosing:',
    getGuardWebAppButton(env.webAppUrl)
  );
}

// ==================== Yordamchi funksiyalar ====================

/**
 * Bazadan foydalanuvchini olish
 */
async function getUser(telegramId) {
  try {
    return await db('users').where('telegram_id', telegramId).first();
  } catch (error) {
    console.error('[MENU] DB xatolik:', error.message);
    return null;
  }
}

/**
 * Ro'yxatdan o'tmagan foydalanuvchiga xabar
 */
async function askToRegister(ctx) {
  await ctx.reply(
    '⚠️ Avval ro\'yxatdan o\'ting.\nBuning uchun /start buyrug\'ini yuboring.'
  );
}

/**
 * Bloklangan foydalanuvchiga xabar
 */
async function showBanned(ctx) {
  await ctx.reply('⛔ Sizning hisobingiz bloklangan. Iltimos, admin bilan bog\'laning.');
}

module.exports = {
  handleOpenApp,
  handleAdminPanel,
  handleQRScanner,
};
