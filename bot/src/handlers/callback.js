/**
 * Callback query handler
 */
const ExcelJS = require('exceljs');
const db = require('../config/db');
const env = require('../config/env');
const { ROLES } = require('shared');

async function callbackHandler(ctx) {
  const callbackData = ctx.callbackQuery.data;

  switch (callbackData) {
    case 'admin_export_users':
      await handleExportUsers(ctx);
      break;
    default:
      await ctx.answerCbQuery('⚠️ Noma\'lum buyruq');
      break;
  }
}

async function handleExportUsers(ctx) {
  const telegramId = ctx.from.id;

  // Admin tekshiruvi
  const user = await db('users').where('telegram_id', telegramId).first();
  const isSuperAdmin = env.adminId && telegramId === env.adminId;
  if (!user || (user.role !== ROLES.ADMIN && !isSuperAdmin)) {
    return ctx.answerCbQuery('⛔ Ruxsat yo\'q');
  }

  await ctx.answerCbQuery('⏳ Excel tayyorlanmoqda...');

  try {
    const users = await db('users').orderBy('registered_at', 'asc');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Foydalanuvchilar');

    // Ustunlar
    sheet.columns = [
      { header: '№', key: 'num', width: 6 },
      { header: 'Ism', key: 'full_name', width: 25 },
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Telegram ID', key: 'telegram_id', width: 18 },
      { header: 'Telefon', key: 'phone', width: 18 },
      { header: 'Rol', key: 'role', width: 10 },
      { header: 'Ball', key: 'score', width: 8 },
      { header: 'Bloklangan', key: 'is_banned', width: 12 },
      { header: "Ro'yxatga olingan", key: 'created_at', width: 22 },
    ];

    // Header uslubi
    sheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E75B6' } };
      cell.alignment = { horizontal: 'center' };
    });

    // Ma'lumotlar
    users.forEach((u, i) => {
      sheet.addRow({
        num: i + 1,
        full_name: u.full_name,
        username: u.username ? `@${u.username}` : '—',
        telegram_id: u.telegram_id,
        phone: u.phone || '—',
        role: u.role,
        score: u.score,
        is_banned: u.is_banned ? 'Ha' : 'Yo\'q',
        created_at: u.registered_at ? new Date(u.registered_at).toLocaleString('uz-UZ') : '—',
      });
    });

    // Qator ranglari (alternating)
    for (let i = 2; i <= users.length + 1; i++) {
      if (i % 2 === 0) {
        sheet.getRow(i).eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
        });
      }
    }

    // Bufferga yozish
    const buffer = await workbook.xlsx.writeBuffer();
    const date = new Date().toISOString().slice(0, 10);
    const filename = `users_${date}.xlsx`;

    await ctx.replyWithDocument(
      { source: Buffer.from(buffer), filename },
      { caption: `✅ Jami *${users.length}* foydalanuvchi | ${date}`, parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('[EXPORT] Xatolik:', error.message);
    await ctx.reply('❌ Export qilishda xatolik yuz berdi.');
  }
}

module.exports = callbackHandler;
