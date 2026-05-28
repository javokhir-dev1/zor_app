/**
 * Zo'r TV Fan Club — Telegram Bot
 *
 * Asosiy entry point. Telegraf.js bilan bot ishga tushadi.
 *
 * Oqim:
 * 1. /start → kontakt so'rash (yangi user) yoki menyu ko'rsatish (mavjud user)
 * 2. Kontakt yuborilganda → bazaga saqlash → rolga qarab menyu
 * 3. Menyu tugmalari → tegishli Web App inline tugmasini yuborish
 *
 * Rollar:
 * - user:  "📺 Ilovani ochish"  → Asosiy Web App
 * - guard: "📷 QR Skaner"       → QR Skaner Web App
 * - admin: "⚙️ Admin Panel"     → Admin Panel Web App
 */
require('dotenv').config();
const { Telegraf } = require('telegraf');
const env = require('./config/env');

// Buyruqlar
const startCommand = require('./commands/start');
const helpCommand = require('./commands/help');

// Handlerlar
const contactHandler = require('./handlers/contact');
const { handleOpenApp, handleAdminPanel, handleQRScanner } = require('./handlers/menu');
const callbackHandler = require('./handlers/callback');

// ==================== BOT YARATISH ====================

if (!env.botToken) {
  console.error('❌ BOT_TOKEN topilmadi! .env faylini tekshiring.');
  process.exit(1);
}

const bot = new Telegraf(env.botToken);

// Bot instance'ni global qilib saqlash (mailing uchun kerak bo'ladi)
global.bot = bot;

// ==================== MIDDLEWARE ====================

// Xatolik ushlagich
bot.catch((err, ctx) => {
  console.error(`[BOT ERROR] ${ctx.updateType}:`, err.message);
});

// ==================== BUYRUQLAR ====================

bot.command('start', startCommand);
bot.command('help', helpCommand);

// ==================== HANDLERLAR ====================

// Kontakt (telefon raqam) handler
bot.on('contact', contactHandler);

// Reply Keyboard menyu tugmalari
bot.hears('📺 Ilovani ochish', handleOpenApp);
bot.hears('⚙️ Admin Panel', handleAdminPanel);
bot.hears('📷 QR Skaner', handleQRScanner);

// Callback query'lar (inline tugmalar)
bot.on('callback_query', callbackHandler);

// Noma'lum xabarlar
bot.on('text', async (ctx) => {
  await ctx.reply(
    '🤔 Tushunmadim. Quyidagi buyruqlardan foydalaning:\n\n' +
    '/start — Boshlash\n' +
    '/help — Yordam'
  );
});

// ==================== ISHGA TUSHIRISH ====================

async function startBot() {
  try {
    // Bot ma'lumotlarini olish
    const botInfo = await bot.telegram.getMe();
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║     📺  Zo\'r TV Fan Club Bot            ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  🤖 Bot: @${botInfo.username}`);
    console.log(`║  🌐 Web App: ${env.webAppUrl}`);
    console.log(`║  📡 Mode: Long Polling`);
    console.log('╚══════════════════════════════════════════╝');
    console.log('');

    // Long polling rejimida ishga tushirish
    await bot.launch();
    console.log('✅ Bot muvaffaqiyatli ishga tushdi!\n');
  } catch (error) {
    console.error('❌ Bot ishga tushmadi:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n🛑 Bot to\'xtatilmoqda (SIGINT)...');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  console.log('\n🛑 Bot to\'xtatilmoqda (SIGTERM)...');
  bot.stop('SIGTERM');
});

startBot();

module.exports = bot;
