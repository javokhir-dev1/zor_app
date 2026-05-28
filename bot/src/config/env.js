require('dotenv').config();

module.exports = {
  botToken: process.env.BOT_TOKEN || '',
  webAppUrl: process.env.WEBAPP_URL || 'https://your-domain.com',
  adminId: parseInt(process.env.ADMIN_ID, 10) || 0,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'zortv_db',
    user: process.env.DB_USER || 'zortv_user',
    password: process.env.DB_PASSWORD || 'zortv_secret_2026',
  },
};
