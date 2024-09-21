import type { Knex } from 'knex';
import { MEDIA_TYPES } from '../../../components/medias/service/media.constants';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('medias', (table) => {
    table.uuid('id').primary();
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');

    table.string('name').notNullable();
    table.string('notes', 1000);
    table.string('content').notNullable();
    table.enum('type', Object.values(MEDIA_TYPES), { useNative: true, enumName: 'media_type_enum', }).notNullable();

    table.integer('duration');
    table.string('mime_type').notNullable();
    table.integer('size');

    table.timestamps(true, true, false);
  });

  await knex.raw(`
    CREATE TRIGGER change_updated_at_on_row_modification
    BEFORE UPDATE ON medias
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER change_updated_at_on_row_modification ON medias');
  await knex.schema.dropTable('medias');
  await knex.raw('DROP TYPE sim_cards_state_enum');
}
