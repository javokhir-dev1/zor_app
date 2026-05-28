/**
 * Bildirishnoma xizmati
 *
 * Bot orqali foydalanuvchilarga xabar yuborish.
 * Admin paneldan mailing va QR-kod yuborish uchun ishlatiladi.
 */
const { Telegraf } = require('telegraf');

/**
 * Bitta foydalanuvchiga xabar yuborish
 */
async function sendNotification(bot, telegramId, message, options = {}) {
  try {
    await bot.telegram.sendMessage(telegramId, message, {
      parse_mode: 'Markdown',
      ...options,
    });
    return { success: true };
  } catch (error) {
    console.error(`[NOTIFY] Xatolik (${telegramId}):`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Ko'p foydalanuvchilarga xabar yuborish (mailing)
 * Telegram rate limit: ~30 xabar/soniya
 */
async function sendBulkNotification(bot, telegramIds, message, options = {}) {
  const results = { sent: 0, failed: 0, errors: [] };

  for (const telegramId of telegramIds) {
    const result = await sendNotification(bot, telegramId, message, options);

    if (result.success) {
      results.sent++;
    } else {
      results.failed++;
      results.errors.push({ telegramId, error: result.error });
    }

    // Telegram rate limit — 30 xabar/soniya
    await sleep(35);
  }

  return results;
}

/**
 * Rasm bilan xabar yuborish (QR-kod uchun)
 */
async function sendPhoto(bot, telegramId, photoBuffer, caption = '') {
  try {
    await bot.telegram.sendPhoto(telegramId, { source: photoBuffer }, {
      caption,
      parse_mode: 'Markdown',
    });
    return { success: true };
  } catch (error) {
    console.error(`[PHOTO] Xatolik (${telegramId}):`, error.message);
    return { success: false, error: error.message };
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  sendNotification,
  sendBulkNotification,
  sendPhoto,
};
