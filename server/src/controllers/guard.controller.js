/**
 * Guard Controller
 *
 * QR-kodni skanerlash va tekshirish.
 * Faqat guard va admin rollar kiradi.
 */
const db = require('../config/db');
const { TICKET_STATUS } = require('shared');

/**
 * POST /api/guard/verify-qr
 * Body: { qr_code: "uuid-string" }
 *
 * QR-kodni tekshirish va chiptani "used" qilish.
 */
async function verifyQR(req, res) {
  try {
    const { qr_code } = req.body;

    if (!qr_code) {
      return res.status(400).json({ error: 'QR-kod talab qilinadi.' });
    }

    // Chiptani topish
    const ticket = await db('tickets')
      .where('qr_code', qr_code)
      .first();

    if (!ticket) {
      return res.status(404).json({
        valid: false,
        error: 'Bu QR-kod tizimda topilmadi.',
      });
    }

    // Status tekshirish
    if (ticket.status === TICKET_STATUS.USED) {
      return res.status(409).json({
        valid: false,
        error: 'Bu chipta allaqachon ishlatilgan.',
      });
    }

    if (ticket.status === TICKET_STATUS.CANCELLED) {
      return res.status(400).json({
        valid: false,
        error: 'Bu chipta bekor qilingan.',
      });
    }

    if (ticket.status !== TICKET_STATUS.CONFIRMED) {
      return res.status(400).json({
        valid: false,
        error: 'Bu chipta hali tasdiqlanmagan.',
      });
    }

    // Foydalanuvchi va ko'rsatuv ma'lumotlarini olish
    const user = await db('users')
      .where('id', ticket.user_id)
      .select('id', 'full_name', 'phone', 'telegram_id')
      .first();

    const show = await db('shows')
      .where('id', ticket.show_id)
      .select('id', 'title', 'show_date', 'location')
      .first();

    // Chiptani "used" qilish
    await db('tickets')
      .where('id', ticket.id)
      .update({ status: TICKET_STATUS.USED });

    res.json({
      valid: true,
      message: 'Chipta tasdiqlandi! Kirish ruxsat etildi.',
      ticket: {
        id: ticket.id,
        status: 'used',
      },
      user: user,
      show: show,
    });
  } catch (error) {
    console.error('[GUARD] QR xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

module.exports = { verifyQR };
