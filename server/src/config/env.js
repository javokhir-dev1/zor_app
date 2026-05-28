require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  botToken: process.env.BOT_TOKEN || '',
  adminId: parseInt(process.env.ADMIN_ID, 10) || 0,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'zortv_db',
    user: process.env.DB_USER || 'zortv_user',
    password: process.env.DB_PASSWORD || 'zortv_secret_2026',
  },
};
