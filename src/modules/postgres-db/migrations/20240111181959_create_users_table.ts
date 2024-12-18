import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('password').notNullable();
    table.string('avatar_url');
    table.string('language').notNullable();
    table.timestamp('account_blocked_at');
    table.string('account_blocked_reason');
    table.timestamp('email_verified_at');
    table.boolean('two_factor_auth_enabled').notNullable().defaultTo(false);
    table.timestamps(true, true, false);
    table.timestamp('deleted_at');
  });

  await knex.raw(`
    CREATE TRIGGER change_updated_at_on_row_modification
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER change_updated_at_on_row_modification ON users');
  await knex.schema.dropTable('users');
}

