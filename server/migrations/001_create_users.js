/**
 * Migratsiya 001: users jadvali
 * 
 * Foydalanuvchilar — tizimning asosiy jadvali.
 * RBAC uchun 'role' maydoni: user | guard | admin
 * Leaderboard uchun 'score' maydoni to'g'ridan-to'g'ri shu yerda.
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.bigInteger('telegram_id').unique().notNullable();
    table.string('full_name', 255).notNullable();
    table.string('phone', 20).notNullable();
    table.string('username', 100).nullable();
    table.string('role', 20).defaultTo('user').notNullable();
    table.integer('score').defaultTo(0).notNullable();
    table.boolean('is_banned').defaultTo(false).notNullable();
    table.timestamp('registered_at').defaultTo(knex.fn.now());
    table.timestamp('last_active_at').nullable();

    // Indekslar
    table.index('score', 'idx_users_score');
    table.index('role', 'idx_users_role');
    table.index('is_banned', 'idx_users_is_banned');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
