/**
 * Show Controller
 *
 * Ko'rsatuvlar ro'yxati va joy band qilish
 */
const db = require('../config/db');
const { TICKET_STATUS } = require('shared');

/**
 * GET /api/shows
 * Faol ko'rsatuvlar ro'yxati
 */
async function listShows(req, res) {
  try {
    const shows = await db('shows')
      .where('is_active', true)
      .where('show_date', '>', new Date())
      .orderBy('show_date', 'asc');

    // Foydalanuvchining chiptalari
    const userTickets = await db('tickets')
      .where('user_id', req.user.userId)
      .select('show_id', 'status', 'qr_code');

    const ticketMap = {};
    userTickets.forEach((t) => {
      ticketMap[t.show_id] = { status: t.status, qr_code: t.qr_code };
    });

    const result = shows.map((show) => ({
      ...show,
      user_ticket: ticketMap[show.id] || null,
    }));

    res.json({ shows: result });
  } catch (error) {
    console.error('[SHOW] List xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * POST /api/shows/:id/book
 * Joy band qilish
 */
async function bookShow(req, res) {
  try {
    const showId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    // Tranzaksiya ichida — race condition'ni oldini olish
    const result = await db.transaction(async (trx) => {
      // Ko'rsatuvni qulflash
      const show = await trx('shows')
        .where('id', showId)
        .where('is_active', true)
        .forUpdate()
        .first();

      if (!show) {
        throw { status: 404, message: 'Ko\'rsatuv topilmadi yoki faol emas.' };
      }

      if (show.available_seats <= 0) {
        throw { status: 400, message: 'Bo\'sh joy qolmagan.' };
      }

      if (new Date(show.show_date) < new Date()) {
        throw { status: 400, message: 'Ko\'rsatuv vaqti o\'tgan.' };
      }

      // Takroriy chipta tekshirish
      const existing = await trx('tickets')
        .where('user_id', userId)
        .where('show_id', showId)
        .first();

      if (existing) {
        throw { status: 409, message: 'Bu ko\'rsatuvga allaqachon chipta olgansiz.' };
      }

      // Chipta yaratish
      const [ticket] = await trx('tickets')
        .insert({
          user_id: userId,
          show_id: showId,
          status: TICKET_STATUS.BOOKED,
        })
        .returning('*');

      // Bo'sh joylarni kamaytirish
      await trx('shows')
        .where('id', showId)
        .decrement('available_seats', 1);

      return ticket;
    });

    res.status(201).json({
      message: 'Joy muvaffaqiyatli band qilindi! Admin tasdiqlashini kuting.',
      ticket: result,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('[SHOW] Book xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

module.exports = { listShows, bookShow };
