/**
 * Migratsiya 002: tasks jadvali
 * 
 * Geymifikatsiya topshiriqlari.
 * Admin paneldan CRUD qilinadi.
 * 'meta' (JSONB) — moslashuvchan qo'shimcha ma'lumot.
 */
exports.up = function (knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description').nullable();
    table.string('type', 50).notNullable(); // daily, weekly, one_time, special
    table.integer('reward_points').notNullable();
    table.jsonb('meta').nullable();
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamp('starts_at').nullable();
    table.timestamp('expires_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tasks');
};
