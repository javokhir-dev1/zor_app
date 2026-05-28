/**
 * /start buyrug'i
 *
 * Oqim:
 * 1. Foydalanuvchi bazada bormi tekshir
 * 2. Agar bor va kontakti saqlangan → rolga qarab menyu ko'rsat
 * 3. Agar yo'q → telefon raqamini so'ra (kontakt klaviaturasi)
 */
const db = require('../config/db');
const env = require('../config/env');
const { ROLES } = require('shared');
const { getContactKeyboard, getMainMenuKeyboard } = require('../keyboards');

async function startCommand(ctx) {
  const telegramId = ctx.from.id;

  try {
    // Bazada foydalanuvchini qidirish
    const existingUser = await db('users')
      .where('telegram_id', telegramId)
      .first();

    if (existingUser) {
      // Super admin tekshiruvi — .env dagi ADMIN_ID
      const isSuperAdmin = env.adminId && telegramId === env.adminId;

      // Super admin har doim admin bo'lishi kerak
      if (isSuperAdmin && existingUser.role !== ROLES.ADMIN) {
        await db('users')
          .where('id', existingUser.id)
          .update({ role: ROLES.ADMIN, is_banned: false, last_active_at: db.fn.now() });
        existingUser.role = ROLES.ADMIN;
        existingUser.is_banned = false;
      } else {
        await db('users')
          .where('id', existingUser.id)
          .update({ last_active_at: db.fn.now() });
      }

      // Ban tekshirish (super admin hech qachon ban bo'lmaydi)
      if (existingUser.is_banned && !isSuperAdmin) {
        return ctx.reply(
          '⛔ Sizning hisobingiz bloklangan. Iltimos, admin bilan bog\'laning.'
        );
      }

      // Rolga qarab menyu
      const roleName = getRoleName(existingUser.role);
      await ctx.reply(
        `👋 Xush kelibsiz, ${existingUser.full_name}!\n\n` +
        `📊 Sizning balingiz: ${existingUser.score}\n` +
        `🔑 Rol: ${roleName}\n\n` +
        `Quyidagi tugmani bosing:`,
        getMainMenuKeyboard(existingUser.role)
      );
    } else {
      // Yangi foydalanuvchi — telefon raqamini so'rash
      await ctx.reply(
        '👋 Zo\'r TV Fan Club\'ga xush kelibsiz!\n\n' +
        '📱 Ro\'yxatdan o\'tish uchun telefon raqamingizni yuboring.\n' +
        'Pastdagi tugmani bosing:',
        getContactKeyboard()
      );
    }
  } catch (error) {
    console.error('[START] Xatolik:', error.message);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
}

/**
 * Rol nomini o'zbek tilida qaytarish
 */
function getRoleName(role) {
  switch (role) {
    case 'admin': return '👑 Admin';
    case 'guard': return '🛡️ Qorovul';
    default: return '👤 Foydalanuvchi';
  }
}

module.exports = startCommand;
