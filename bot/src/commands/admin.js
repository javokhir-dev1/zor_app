/**
 * /admin buyrug'i
 *
 * Faqat admin uchun — kichik boshqaruv paneli.
 */
const db = require('../config/db');
const env = require('../config/env');
const { ROLES } = require('shared');
const { Markup } = require('telegraf');

async function adminCommand(ctx) {
  const telegramId = ctx.from.id;

  // Admin tekshiruvi
  const user = await db('users').where('telegram_id', telegramId).first();
  const isSuperAdmin = env.adminId && telegramId === env.adminId;

  if (!user || (user.role !== ROLES.ADMIN && !isSuperAdmin)) {
    return ctx.reply('⛔ Bu buyruq faqat adminlar uchun.');
  }

  const totalUsers = await db('users').count('id as count').first();

  await ctx.reply(
    `⚙️ *Admin Panel*\n\n` +
    `👥 Jami foydalanuvchilar: *${totalUsers.count}*\n\n` +
    `Quyidagi amallardan birini tanlang:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📊 Foydalanuvchilarni Excel ga export qilish', 'admin_export_users')],
      ]),
    }
  );
}

module.exports = adminCommand;
