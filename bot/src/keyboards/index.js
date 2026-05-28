/**
 * Klaviaturalar generatori
 *
 * Rolga qarab turli Reply Keyboard va Inline Keyboard'lar yaratadi.
 * - User:  "📺 Ilovani ochish"
 * - Guard: "📷 QR Skaner"
 * - Admin: "⚙️ Admin Panel"
 */
const { Markup } = require('telegraf');
const { ROLES } = require('shared');

// ==================== REPLY KEYBOARD (pastdagi tugmalar) ====================

/**
 * Telefon raqamini so'rash klaviaturasi
 */
function getContactKeyboard() {
  return Markup.keyboard([
    Markup.button.contactRequest('📱 Telefon raqamni yuborish'),
  ])
    .oneTime()
    .resize();
}

/**
 * Rolga qarab asosiy menyu klaviaturasi
 */
function getMainMenuKeyboard(role) {
  switch (role) {
    case ROLES.ADMIN:
      return Markup.keyboard([
        ['⚙️ Admin Panel'],
        ['📺 Ilovani ochish'],
      ]).resize();

    case ROLES.GUARD:
      return Markup.keyboard([
        ['📷 QR Skaner'],
      ]).resize();

    case ROLES.USER:
    default:
      return Markup.keyboard([
        ['📺 Ilovani ochish'],
      ]).resize();
  }
}

// ==================== INLINE KEYBOARD (xabar ichidagi tugmalar) ====================

/**
 * Asosiy Web App ochish tugmasi (User uchun)
 */
function getWebAppButton(webAppUrl) {
  return Markup.inlineKeyboard([
    [Markup.button.webApp('📺 Zo\'r TV Fan Club', webAppUrl)],
  ]);
}

/**
 * Admin Panel Web App ochish tugmasi
 */
function getAdminWebAppButton(webAppUrl) {
  const url = webAppUrl.replace(/\/+$/, '');
  return Markup.inlineKeyboard([
    [Markup.button.webApp('⚙️ Admin Panel', `${url}/admin`)],
  ]);
}

/**
 * Guard QR Skaner Web App ochish tugmasi
 */
function getGuardWebAppButton(webAppUrl) {
  const url = webAppUrl.replace(/\/+$/, '');
  return Markup.inlineKeyboard([
    [Markup.button.webApp('📷 QR Skaner', `${url}/guard`)],
  ]);
}

module.exports = {
  getContactKeyboard,
  getMainMenuKeyboard,
  getWebAppButton,
  getAdminWebAppButton,
  getGuardWebAppButton,
};
