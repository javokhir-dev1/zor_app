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
      console.error('[AUTH] Raw initData:', initData);
      // DEBUG: Vaqtinchalik — muammoni tashxis qilish uchun
      return res.status(401).json({
        error: err.message,
        debug: {
          botTokenLength: env.botToken?.length,
          botTokenFirst10: env.botToken?.substring(0, 10),
          initDataLength: initData?.length,
          initDataFirst100: initData?.substring(0, 100),
          initDataKeys: initData ? initData.split('&').map(p => p.substring(0, p.indexOf('='))) : [],
          ...(err.debugInfo || {}),
        },
      });
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
  // initData ni raw holda parse qilish (URLSearchParams decode qilmasligi uchun)
  const pairs = initDataString.split('&');
  const rawMap = {};
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.substring(0, idx);
    const val = pair.substring(idx + 1);
    rawMap[key] = val; // URL-encoded holda saqlanadi
  }

  const hash = rawMap['hash'];
  if (!hash) {
    throw new Error('initData da hash topilmadi.');
  }

  // hash'ni chiqarib tashlab, qolganlarini saralash
  // MUHIM: faqat 'hash' chiqariladi, 'signature' qoladi (Telegram spec)
  const dataCheckString = pairs
    .filter(p => {
      const key = p.substring(0, p.indexOf('='));
      return key !== 'hash';
    })
    .map(p => {
      const idx = p.indexOf('=');
      const key = p.substring(0, idx);
      const val = decodeURIComponent(p.substring(idx + 1));
      return `${key}=${val}`;
    })
    .sort()
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

  // DEBUG: Vaqtinchalik log
  console.log('[AUTH DEBUG] dataCheckString:', JSON.stringify(dataCheckString));
  console.log('[AUTH DEBUG] calculatedHash:', calculatedHash);
  console.log('[AUTH DEBUG] received hash:', hash);
  console.log('[AUTH DEBUG] botToken first 10:', botToken.substring(0, 10));

  // Imzoni solishtirish (timing-safe comparison)
  const calcBuf = Buffer.from(calculatedHash, 'hex');
  const hashBuf = Buffer.from(hash, 'hex');
  if (calcBuf.length !== hashBuf.length || !crypto.timingSafeEqual(calcBuf, hashBuf)) {
    // DEBUG: Vaqtinchalik — aniq farqni ko'rish uchun
    const err = new Error('initData imzosi noto\'g\'ri.');
    err.debugInfo = {
      calculatedHash,
      receivedHash: hash,
      dataCheckStringPreview: dataCheckString.substring(0, 200),
      dataCheckStringLength: dataCheckString.length,
    };
    throw err;
  }

  // Vaqt tekshiruvi
  const decodedMap = {};
  for (const [key, val] of Object.entries(rawMap)) {
    decodedMap[key] = decodeURIComponent(val);
  }

  const authDate = parseInt(decodedMap['auth_date'], 10);
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > INIT_DATA_MAX_AGE_SECONDS) {
    throw new Error('initData muddati o\'tgan.');
  }

  // Foydalanuvchi ma'lumotlarini qaytarish
  const userParam = decodedMap['user'];
  if (!userParam) {
    throw new Error('initData da user ma\'lumoti topilmadi.');
  }

  return JSON.parse(userParam);
}

module.exports = { authenticate };
