import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('playlists_medias', (table) => {
    table.uuid('id').primary();
    table.uuid('playlist_id').notNullable().references('id').inTable('playlists').onDelete('CASCADE');
    table.uuid('media_id').notNullable().references('id').inTable('medias').onDelete('CASCADE');

    // table.integer('sequence').notNullable();
    table.string('duration').notNullable();

    table.timestamps(true, true, false);
  });

  await knex.raw(`
    CREATE TRIGGER change_updated_at_on_row_modification
    BEFORE UPDATE ON playlists_medias
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER change_updated_at_on_row_modification ON playlists_medias');
  await knex.schema.dropTable('playlists_medias');
}
