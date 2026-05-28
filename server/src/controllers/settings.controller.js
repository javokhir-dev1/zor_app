/**
 * Settings Controller
 *
 * Stream URL'lar va boshqa tizim sozlamalari
 */
const db = require('../config/db');
const { SETTING_KEYS } = require('shared');

/**
 * GET /api/settings/stream-urls
 * TV va Radio URL'larini olish (public — hamma uchun)
 */
async function getStreamUrls(req, res) {
  try {
    const settings = await db('settings')
      .whereIn('key', [SETTING_KEYS.LIVE_TV_URL, SETTING_KEYS.RADIO_URL]);

    const result = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });

    res.json({
      live_tv_url: result[SETTING_KEYS.LIVE_TV_URL] || null,
      radio_url: result[SETTING_KEYS.RADIO_URL] || null,
    });
  } catch (error) {
    console.error('[SETTINGS] Stream URL xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * GET /api/admin/settings
 * Barcha sozlamalar (admin uchun)
 */
async function getAllSettings(req, res) {
  try {
    const settings = await db('settings').orderBy('key');
    res.json({ settings });
  } catch (error) {
    console.error('[SETTINGS] List xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * PUT /api/admin/settings
 * Sozlamalarni yangilash (admin uchun)
 * Body: { key: "live_tv_url", value: "https://..." }
 */
async function updateSetting(req, res) {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: 'key va value kerak.' });
    }

    const existing = await db('settings').where('key', key).first();

    if (existing) {
      await db('settings').where('key', key).update({
        value,
        updated_at: db.fn.now(),
      });
    } else {
      await db('settings').insert({ key, value });
    }

    res.json({ message: 'Sozlama yangilandi.', key, value });
  } catch (error) {
    console.error('[SETTINGS] Update xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

module.exports = { getStreamUrls, getAllSettings, updateSetting };
