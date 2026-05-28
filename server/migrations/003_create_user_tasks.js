/**
 * Migratsiya 003: user_tasks jadvali
 * 
 * Foydalanuvchi va topshiriq o'rtasidagi bog'liqlik.
 * Bitta foydalanuvchi bitta topshiriqni faqat bir marta bajarishi mumkin (UNIQUE constraint).
 * 'proof' (JSONB) — foydalanuvchi yuborgan isbotlash ma'lumoti.
 */
exports.up = function (knex) {
  return knex.schema.createTable('user_tasks', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable();
    table
      .integer('task_id')
      .unsigned()
      .references('id')
      .inTable('tasks')
      .onDelete('CASCADE')
      .notNullable();
    table.string('status', 20).defaultTo('pending').notNullable(); // pending, submitted, approved, rejected
    table.jsonb('proof').nullable();
    table.timestamp('completed_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Bitta user bitta taskni faqat bir marta bajarishi mumkin
    table.unique(['user_id', 'task_id'], 'uq_user_task');

    // Indekslar
    table.index('user_id', 'idx_user_tasks_user');
    table.index('status', 'idx_user_tasks_status');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_tasks');
};
