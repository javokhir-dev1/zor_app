/**
 * Baza va foydalanuvchi yaratish skripti
 * 
 * Ishga tushirish:
 *   node server/scripts/setup_db.js
 * 
 * Bu skript:
 * 1. PostgreSQL'ga postgres foydalanuvchisi bilan ulanadi
 * 2. zortv_user rolini yaratadi
 * 3. zortv_db bazasini yaratadi
 * 4. Huquqlar beradi
 */
const { Client } = require('pg');

const SUPERUSER = process.env.PG_SUPERUSER || 'postgres';
const SUPERUSER_PASS = process.env.PG_SUPERUSER_PASS || 'postgres';
const DB_NAME = 'zortv_db';
const DB_USER = 'zortv_user';
const DB_PASS = 'zortv_secret_2026';

async function setup() {
  // 1. postgres bazasiga ulanish
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: SUPERUSER,
    password: SUPERUSER_PASS,
  });

  try {
    await client.connect();
    console.log('✅ PostgreSQL\'ga ulandi.');

    // 2. Foydalanuvchi yaratish
    const roleCheck = await client.query(
      "SELECT 1 FROM pg_roles WHERE rolname = $1", [DB_USER]
    );
    if (roleCheck.rows.length === 0) {
      await client.query(`CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}'`);
      console.log(`✅ Foydalanuvchi "${DB_USER}" yaratildi.`);
    } else {
      console.log(`ℹ️  Foydalanuvchi "${DB_USER}" allaqachon mavjud.`);
    }

    // 3. Baza yaratish
    const dbCheck = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1", [DB_NAME]
    );
    if (dbCheck.rows.length === 0) {
      await client.query(`CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}`);
      console.log(`✅ Baza "${DB_NAME}" yaratildi.`);
    } else {
      console.log(`ℹ️  Baza "${DB_NAME}" allaqachon mavjud.`);
    }

    // 4. Huquqlar
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER}`);
    console.log(`✅ Huquqlar berildi.`);

    console.log('\n🎉 Baza tayyorlash tugadi! Endi migratsiya ishga tushiring:');
    console.log('   npx knex migrate:latest --knexfile server/knexfile.js');
    console.log('   npx knex seed:run --knexfile server/knexfile.js');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ PostgreSQL ishga tushmagan! Avval PostgreSQL serverini ishga tushiring.');
    } else if (error.code === '28P01') {
      console.error(`❌ Parol noto'g'ri! postgres foydalanuvchisi uchun parolni to'g'ri kiriting.`);
      console.error(`   Foydalanish: PG_SUPERUSER_PASS=sizning_parol node server/scripts/setup_db.js`);
    } else {
      console.error('❌ Xatolik:', error.message);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

setup();
