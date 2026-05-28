/**
 * Migratsiya 005: tickets jadvali
 * 
 * Ko'rsatuvlarga chipta (joy band qilish).
 * Har bir chipta noyob UUID (qr_code) ga ega — Guard skanerlash uchun.
 * Bitta foydalanuvchi bitta ko'rsatuvga faqat bitta chipta olishi mumkin.
 */
exports.up = function (knex) {
  return knex.schema.createTable('tickets', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable();
    table
      .integer('show_id')
      .unsigned()
      .references('id')
      .inTable('shows')
      .onDelete('CASCADE')
      .notNullable();
    table.string('status', 20).defaultTo('booked').notNullable(); // booked, confirmed, cancelled, used
    table.uuid('qr_code').unique().notNullable().defaultTo(knex.fn.uuid());
    table.timestamp('booked_at').defaultTo(knex.fn.now());
    table.timestamp('confirmed_at').nullable();

    // Bitta user bitta showga faqat bitta chipta
    table.unique(['user_id', 'show_id'], 'uq_user_show');

    // Indekslar
    table.index('user_id', 'idx_tickets_user');
    table.index('show_id', 'idx_tickets_show');
    table.index('qr_code', 'idx_tickets_qr');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tickets');
};
