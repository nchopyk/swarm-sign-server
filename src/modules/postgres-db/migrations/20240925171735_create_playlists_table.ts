import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('playlists', (table) => {
    table.uuid('id').primary();
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');

    table.string('name').notNullable();
    table.string('notes', 1000);

    table.timestamps(true, true, false);
  });

  await knex.raw(`
    CREATE TRIGGER change_updated_at_on_row_modification
    BEFORE UPDATE ON playlists
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER change_updated_at_on_row_modification ON playlists');
  await knex.schema.dropTable('playlists');
}
