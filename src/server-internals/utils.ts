import logger from '../modules/logger';
import postgresDB from '../modules/postgres-db';

export async function connectAllExternalServices() {
  try {
    await Promise.all([
      postgresDB.connect(),
    ]);
  } catch (error) {
    logger.error(error as Error, { tag: 'CONNECTION MANAGER' });
    process.exit(1);
  }
}
