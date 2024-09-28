import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('schedules', (table) => {
    table.uuid('id').primary();
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('screen_id').notNullable().references('id').inTable('screens').onDelete('CASCADE');
    table.uuid('playlist_id').notNullable().references('id').inTable('playlists').onDelete('CASCADE');

    table.string('name').notNullable();
    table.string('notes');

    table.timestamps(true, true, false);
  });

  await knex.raw(`
    CREATE TRIGGER change_updated_at_on_row_modification
    BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER change_updated_at_on_row_modification ON schedules');
  await knex.schema.dropTable('schedules');
}
