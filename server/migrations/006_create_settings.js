/**
 * Migratsiya 006: settings jadvali
 * 
 * Tizim sozlamalari (key-value).
 * Admin paneldan boshqariladi.
 * Asosan stream URL'lar (live_tv_url, radio_url) uchun.
 */
exports.up = function (knex) {
  return knex.schema.createTable('settings', (table) => {
    table.increments('id').primary();
    table.string('key', 100).unique().notNullable();
    table.text('value').notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('settings');
};
