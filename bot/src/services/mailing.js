/**
 * Ommaviy xabar yuborish xizmati (Mailing)
 *
 * Admin paneldan chaqiriladi.
 * Barcha yoki filtrlangan foydalanuvchilarga bot orqali xabar yuboradi.
 */
const db = require('../config/db');
const { sendBulkNotification } = require('./notification');

/**
 * Barcha faol (ban qilinmagan) foydalanuvchilarga xabar yuborish
 */
async function mailToAll(bot, message) {
  const users = await db('users')
    .where('is_banned', false)
    .select('telegram_id');

  const telegramIds = users.map((u) => u.telegram_id);
  console.log(`[MAILING] ${telegramIds.length} ta foydalanuvchiga yuborilmoqda...`);

  return sendBulkNotification(bot, telegramIds, message);
}

/**
 * Top reytingdagi foydalanuvchilarga xabar yuborish
 * @param {number} limit - Nechta top foydalanuvchiga yuborish
 */
async function mailToTopUsers(bot, message, limit = 100) {
  const users = await db('users')
    .where('is_banned', false)
    .orderBy('score', 'desc')
    .limit(limit)
    .select('telegram_id');

  const telegramIds = users.map((u) => u.telegram_id);
  console.log(`[MAILING] Top ${limit} foydalanuvchiga yuborilmoqda...`);

  return sendBulkNotification(bot, telegramIds, message);
}

module.exports = {
  mailToAll,
  mailToTopUsers,
};
