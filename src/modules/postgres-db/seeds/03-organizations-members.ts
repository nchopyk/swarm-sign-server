import { Knex } from 'knex';
import { UsersRepository } from '../../../components/users/service/users.repository';
import { ORGANIZATION_ROLES } from '../../../constants/organization-roles';
import { UserId } from '../../../components/users/service/users.types';
import { OrganizationId } from '../../../components/organizations/service/organizations.types';
import { faker } from '@faker-js/faker';
import { POSTGRES_DB } from '../../../config';


export async function seed(knex: Knex): Promise<void> {
  console.time('Organizations members seed time');

  const usersRepository = new UsersRepository(knex);

  await knex('organizations_members').del();

  const organizations = await knex.select('id').from('organizations');
  const users = await knex.select('id').from('users');

  if (organizations.length > users.length) {
    throw new Error('Not enough users to assign to organizations');
  }

  await createOwners(organizations, users, usersRepository);
  await createAdmins(organizations, users, usersRepository);

  console.timeEnd('Organizations members seed time');
}


async function createOwners(organizations: Array<{ id: OrganizationId }>, users: Array<{ id: UserId }>, usersRepository: UsersRepository) {
  if (organizations.length > users.length) {
    console.log('Warning: not enough users to make all organizations have owners');
  }

  for (const { id: organizationId } of organizations) {
    const owner = users.pop();

    if (!owner) {
      throw new Error('Not enough users to assign to organizations');
    }

    await usersRepository.createUserToOrganizationRelation({
      organizationId,
      userId: owner.id,
      role: ORGANIZATION_ROLES.OWNER,
    });
  }
}

async function createAdmins(organizations: Array<{ id: OrganizationId }>, users: Array<{ id: UserId }>, usersRepository: UsersRepository) {
  const promises: Promise<void>[] = [];

  for (const { id: organizationId } of faker.helpers.shuffle(organizations)) {
    const members = users.slice(0, POSTGRES_DB.SEEDS.MIN_ADMINS_PER_ORGANIZATION);

    if (!members.length) {
      break;
    }

    for (const { id: userId } of members) {
      await usersRepository.createUserToOrganizationRelation({
        organizationId,
        userId,
        role: ORGANIZATION_ROLES.ADMIN,
      });
    }

    users.splice(0,  POSTGRES_DB.SEEDS.MIN_ADMINS_PER_ORGANIZATION);
  }

  if (users.length) {
    await createAdmins(organizations, users, usersRepository);
  }

  await Promise.all(promises);
}
