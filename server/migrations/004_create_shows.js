/**
 * Migratsiya 004: shows jadvali
 * 
 * Telekanal ko'rsatuvlari/tadbirlari.
 * Admin paneldan yaratiladi.
 * 'available_seats' har bir chipta band qilinganda kamayadi.
 */
exports.up = function (knex) {
  return knex.schema.createTable('shows', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description').nullable();
    table.timestamp('show_date').notNullable();
    table.string('location', 255).nullable();
    table.integer('total_seats').notNullable();
    table.integer('available_seats').notNullable();
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Indeks
    table.index(['is_active', 'show_date'], 'idx_shows_active_date');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('shows');
};
