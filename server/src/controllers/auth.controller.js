/**
 * Auth Controller
 *
 * Telegram initData orqali avtorizatsiya.
 * initData tekshirilgandan keyin JWT token yaratiladi.
 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const env = require('../config/env');
const { JWT_EXPIRES_IN, INIT_DATA_MAX_AGE_SECONDS, ROLES } = require('shared');

/**
 * POST /api/auth
 * Body: { initData: string }
 * Response: { token, user }
 */
async function authenticate(req, res) {
  try {
    const { initData } = req.body;

    if (!initData) {
      return res.status(400).json({ error: 'initData kerak.' });
    }

    // 1. initData imzosini tekshirish
    let telegramUser;
    try {
      telegramUser = validateInitData(initData, env.botToken);
    } catch (err) {
      console.error('[AUTH] initData xatolik:', err.message);
      console.error('[AUTH] BOT_TOKEN mavjudmi:', !!env.botToken, '| Uzunligi:', env.botToken?.length);
      return res.status(401).json({ error: err.message });
    }

    // 2. Bazadan foydalanuvchini topish
    const user = await db('users')
      .where('telegram_id', telegramUser.id)
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'Foydalanuvchi topilmadi. Avval bot orqali ro\'yxatdan o\'ting.',
      });
    }

    // 3. Ban tekshirish (super admin bundan mustasno)
    const isSuperAdmin = env.adminId && user.telegram_id === env.adminId;
    if (user.is_banned && !isSuperAdmin) {
      return res.status(403).json({ error: 'Hisobingiz bloklangan.' });
    }

    // 4. Super admin rolini ta'minlash
    if (isSuperAdmin && user.role !== ROLES.ADMIN) {
      await db('users').where('id', user.id).update({ role: ROLES.ADMIN, is_banned: false });
      user.role = ROLES.ADMIN;
      user.is_banned = false;
    }

    // 5. last_active yangilash
    await db('users').where('id', user.id).update({ last_active_at: db.fn.now() });

    // 6. JWT token yaratish
    const token = jwt.sign(
      {
        userId: user.id,
        telegramId: user.telegram_id,
        role: user.role,
      },
      env.jwtSecret,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 7. Javob
    res.json({
      token,
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        full_name: user.full_name,
        username: user.username,
        role: user.role,
        score: user.score,
      },
    });
  } catch (error) {
    console.error('[AUTH] Xatolik:', error.message);
    res.status(500).json({ error: 'Server xatoligi.' });
  }
}

/**
 * Telegram initData imzosini tekshirish
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
function validateInitData(initDataString, botToken) {
  const params = new URLSearchParams(initDataString);
  const hash = params.get('hash');

  if (!hash) {
    throw new Error('initData da hash topilmadi.');
  }

  params.delete('hash');

  // Parametrlarni alifbo tartibida saralash
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${key}=${val}`)
    .join('\n');

  // HMAC-SHA256 imzo hisoblash
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // Imzoni solishtirish
  if (calculatedHash !== hash) {
    throw new Error('initData imzosi noto\'g\'ri.');
  }

  // Vaqt tekshiruvi
  const authDate = parseInt(params.get('auth_date'), 10);
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > INIT_DATA_MAX_AGE_SECONDS) {
    throw new Error('initData muddati o\'tgan.');
  }

  // Foydalanuvchi ma'lumotlarini qaytarish
  const userParam = params.get('user');
  if (!userParam) {
    throw new Error('initData da user ma\'lumoti topilmadi.');
  }

  return JSON.parse(userParam);
}

module.exports = { authenticate };
