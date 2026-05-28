/**
 * Zo'r TV Fan Club — Umumiy validatsiya funksiyalari
 */

const { ALL_ROLES, TASK_TYPE } = require('./constants');

/**
 * Telefon raqamini tekshirish
 * O'zbekiston formati: +998XXXXXXXXX
 */
function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^\+?\d{10,15}$/.test(cleaned);
}

/**
 * Rolni tekshirish
 */
function isValidRole(role) {
  return ALL_ROLES.includes(role);
}

/**
 * Topshiriq turini tekshirish
 */
function isValidTaskType(type) {
  return Object.values(TASK_TYPE).includes(type);
}

/**
 * Telegram ID tekshirish (musbat butun son)
 */
function isValidTelegramId(id) {
  return Number.isInteger(id) && id > 0;
}

/**
 * UUID formatini tekshirish (QR-kod uchun)
 */
function isValidUUID(str) {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

module.exports = {
  isValidPhone,
  isValidRole,
  isValidTaskType,
  isValidTelegramId,
  isValidUUID,
};
