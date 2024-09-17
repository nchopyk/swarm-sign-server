import type { Knex } from 'knex';
import { ORGANIZATION_ROLES } from '../../../constants/organization-roles';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('organizations_invitations', (table) => {
    table.uuid('id').primary();
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('inviter_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('invitee_email').notNullable();
    table.enum('invitee_role', Object.values(ORGANIZATION_ROLES), { useNative: true, enumName: 'organizations_invitations_roles_enum' }).notNullable();
    table.timestamp('accepted_at');
    table.timestamp('rejected_at');
    table.timestamps(true, true, false);

    table.unique(['organization_id', 'invitee_email', 'accepted_at']);
  });

  await knex.raw(`
    CREATE TRIGGER change_updated_at_on_row_modification
    BEFORE UPDATE ON organizations_invitations
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER change_updated_at_on_row_modification ON organizations_invitations');
  await knex.schema.dropTable('organizations_invitations');
  await knex.raw('DROP TYPE organizations_invitations_roles_enum');
}

