import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { OrganizationsRepository } from '../../../components/organizations/service/organizations.repository';
import { POSTGRES_DB } from '../../../config';


export async function seed(knex: Knex): Promise<void> {
  console.time('Organizations seed time');

  const organizationsRepository = new OrganizationsRepository(knex);

  await knex('organizations').del();

  const promises: Promise<void>[] = [];

  for (let i = 0; i < POSTGRES_DB.SEEDS.ORGANIZATIONS_COUNT; i++) {
    promises.push(knex.transaction(async (trx) => {
      await organizationsRepository.create({ name: faker.company.name() }, trx);
    }));
  }

  await Promise.all(promises);

  console.timeEnd('Organizations seed time');
}
