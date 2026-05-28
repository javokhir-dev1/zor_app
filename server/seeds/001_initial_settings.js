/**
 * Seed 001: Boshlang'ich tizim sozlamalari
 * 
 * Stream URL'lar admin paneldan keyinchalik o'zgartiriladi.
 * Bu yerda faqat boshlang'ich qiymatlar kiritiladi.
 */
const { SETTING_KEYS } = require('shared');

exports.seed = async function (knex) {
  // Mavjud sozlamalarni o'chirmasdan, yo'qlarini qo'shamiz
  const settings = [
    {
      key: SETTING_KEYS.LIVE_TV_URL,
      value: 'https://example.com/live/tv.m3u8',
    },
    {
      key: SETTING_KEYS.RADIO_URL,
      value: 'https://example.com/live/radio.m3u8',
    },
  ];

  for (const setting of settings) {
    const exists = await knex('settings').where('key', setting.key).first();
    if (!exists) {
      await knex('settings').insert(setting);
    }
  }
};
