/**
 * /help buyrug'i
 *
 * Foydalanuvchiga bot haqida qisqacha ma'lumot beradi.
 */
async function helpCommand(ctx) {
  await ctx.reply(
    '📺 *Zo\'r TV Fan Club* — rasmiy bot\n\n' +
    '🎯 *Imkoniyatlar:*\n' +
    '• Jonli efirni tomosha qilish\n' +
    '• Radioni tinglash\n' +
    '• Topshiriqlarni bajarish va ball to\'plash\n' +
    '• Reyting jadvalida o\'z o\'rningizni ko\'rish\n' +
    '• Ko\'rsatuvlarga chipta olish\n\n' +
    '📱 Boshlash uchun: /start\n' +
    '❓ Yordam: /help\n\n' +
    '📞 Muammo bo\'lsa: @zortv\\_support',
    { parse_mode: 'Markdown' }
  );
}

module.exports = helpCommand;
