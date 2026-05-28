-- ============================================
-- Zo'r TV Fan Club — Baza yaratish skripti
-- ============================================
-- Ushbu skriptni PostgreSQL'da postgres foydalanuvchisi sifatida ishga tushiring:
--   psql -U postgres -f server/scripts/create_db.sql
-- ============================================

-- 1. Foydalanuvchi yaratish (agar mavjud bo'lmasa)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'zortv_user') THEN
    CREATE ROLE zortv_user WITH LOGIN PASSWORD 'zortv_secret_2026';
    RAISE NOTICE 'Foydalanuvchi "zortv_user" yaratildi.';
  ELSE
    RAISE NOTICE 'Foydalanuvchi "zortv_user" allaqachon mavjud.';
  END IF;
END $$;

-- 2. Baza yaratish (agar mavjud bo'lmasa)
-- PostgreSQL'da IF NOT EXISTS CREATE DATABASE yo'q, shuning uchun tekshiramiz
SELECT 'CREATE DATABASE zortv_db OWNER zortv_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'zortv_db')\gexec

-- 3. Huquqlar berish
GRANT ALL PRIVILEGES ON DATABASE zortv_db TO zortv_user;
