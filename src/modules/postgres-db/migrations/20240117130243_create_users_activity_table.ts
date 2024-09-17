import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users_activity_logs', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('section').notNullable();
    table.string('action').notNullable();
    table.string('status').notNullable();
    table.string('ip_address');
    table.string('user_agent');
    table.jsonb('meta');
    table.timestamps(true, true, false);
  });

  await knex.raw(`
    CREATE TRIGGER change_updated_at_on_row_modification
    BEFORE UPDATE ON users_activity_logs
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER change_updated_at_on_row_modification ON users_activity_logs');
  await knex.schema.dropTable('users_activity_logs');
}
