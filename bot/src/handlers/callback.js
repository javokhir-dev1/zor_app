/**
 * Callback query handler
 * 
 * Inline tugmalar bosilganda ishlaydigan handler.
 * Hozircha placeholder — keyingi bosqichlarda kengaytiriladi.
 */
async function callbackHandler(ctx) {
  const callbackData = ctx.callbackQuery.data;

  switch (callbackData) {
    default:
      await ctx.answerCbQuery('⚠️ Noma\'lum buyruq');
      break;
  }
}

module.exports = callbackHandler;
