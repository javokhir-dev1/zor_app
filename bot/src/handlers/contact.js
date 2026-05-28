/**
 * Kontakt (telefon raqam) handler
 *
 * Oqim:
 * 1. Foydalanuvchi kontaktini qabul qilish
 * 2. Telegram ID, ism, telefon, username — bazaga saqlash
 * 3. Agar allaqachon mavjud bo'lsa — telefon va ismni yangilash
 * 4. Rolga qarab Reply Keyboard menyu ko'rsatish
 */
const db = require('../config/db');
const env = require('../config/env');
const { ROLES } = require('shared');
const { getMainMenuKeyboard } = require('../keyboards');

async function contactHandler(ctx) {
  const contact = ctx.message.contact;

  // Xavfsizlik: faqat o'z kontaktini yuborgan bo'lishi kerak
  if (contact.user_id !== ctx.from.id) {
    return ctx.reply(
      '⚠️ Iltimos, faqat o\'z telefon raqamingizni yuboring.\n' +
      'Pastdagi tugmani bosing.'
    );
  }

  const telegramId = ctx.from.id;
  const fullName = [ctx.from.first_name, ctx.from.last_name]
    .filter(Boolean)
    .join(' ') || 'Noma\'lum';
  const phone = contact.phone_number;
  const username = ctx.from.username || null;

  try {
    // Bazada foydalanuvchini qidirish
    let user = await db('users')
      .where('telegram_id', telegramId)
      .first();

    // Asosiy admin tekshiruvi — .env dagi ADMIN_ID
    const isSuperAdmin = env.adminId && telegramId === env.adminId;

    if (user) {
      // Mavjud foydalanuvchi — ma'lumotlarni yangilash
      const updateData = {
        full_name: fullName,
        phone: phone,
        username: username,
        last_active_at: db.fn.now(),
      };

      // Super admin har doim admin bo'lishi kerak
      if (isSuperAdmin && user.role !== ROLES.ADMIN) {
        updateData.role = ROLES.ADMIN;
        updateData.is_banned = false;
      }

      await db('users').where('id', user.id).update(updateData);

      // Yangilangan ma'lumotni olish
      user = await db('users').where('id', user.id).first();
    } else {
      // Yangi foydalanuvchi — bazaga qo'shish
      const [newUser] = await db('users')
        .insert({
          telegram_id: telegramId,
          full_name: fullName,
          phone: phone,
          username: username,
          role: isSuperAdmin ? ROLES.ADMIN : ROLES.USER,
          score: 0,
          is_banned: false,
        })
        .returning('*');

      user = newUser;

      if (isSuperAdmin) {
        console.log(`[CONTACT] 👑 Super Admin ro'yxatdan o'tdi: ${fullName} (${telegramId})`);
      } else {
        console.log(`[CONTACT] Yangi foydalanuvchi: ${fullName} (${telegramId})`);
      }
    }

    // Ban tekshirish
    if (user.is_banned) {
      return ctx.reply(
        '⛔ Sizning hisobingiz bloklangan. Iltimos, admin bilan bog\'laning.'
      );
    }

    // Muvaffaqiyat xabari + rolga qarab menyu
    await ctx.reply(
      `✅ Ro'yxatdan o'tish muvaffaqiyatli!\n\n` +
      `👤 Ism: ${user.full_name}\n` +
      `📱 Telefon: ${user.phone}\n\n` +
      `Quyidagi tugmani bosib ilovaga kiring:`,
      getMainMenuKeyboard(user.role)
    );
  } catch (error) {
    console.error('[CONTACT] Xatolik:', error.message);
    await ctx.reply('❌ Ro\'yxatdan o\'tishda xatolik. Iltimos, qaytadan /start buyrug\'ini yuboring.');
  }
}

module.exports = contactHandler;
