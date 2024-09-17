import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import usersRepository from '../../../components/users/service/users.repository';
import { hashPassword } from '../../../components/general/utils/general.hash.utils';
import LANGUAGES from '../../../constants/languages';
import { POSTGRES_DB } from '../../../config';

export async function seed(knex: Knex): Promise<void> {
  console.time('Users seed time');

  await knex('users').del();

  const password = await hashPassword(POSTGRES_DB.SEEDS.USERS_PASSWORD);

  for (let i = 0; i < POSTGRES_DB.SEEDS.USERS_COUNT; i++) {
    await usersRepository.create({
      email: faker.internet.email().toLowerCase(),
      password,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      language: faker.helpers.arrayElement(Object.values(LANGUAGES)),
      emailVerifiedAt: faker.date.recent(),
    });
  }


  console.timeEnd('Users seed time');
}
