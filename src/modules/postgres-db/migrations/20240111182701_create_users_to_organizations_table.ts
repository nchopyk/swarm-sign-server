import type { Knex } from 'knex';
import { ORGANIZATION_ROLES } from '../../../constants/organization-roles';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('organizations_members', (table) => {
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.enum('role', Object.values(ORGANIZATION_ROLES), { useNative: true, enumName: 'organizations_members_roles_enum' }).notNullable();
    table.timestamps(true, true, false);

    table.primary(['user_id', 'organization_id']);
  });

  await knex.raw(`
    CREATE TRIGGER change_updated_at_on_row_modification
    BEFORE UPDATE ON organizations_members
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER change_updated_at_on_row_modification ON organizations_members');
  await knex.schema.dropTable('organizations_members');
  await knex.raw('DROP TYPE organizations_members_roles_enum');
}
