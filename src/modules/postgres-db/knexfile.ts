import { POSTGRES_DB } from '../../config';


module.exports = {
  default: {
    client: 'pg',
    connection: {
      host: POSTGRES_DB.HOST,
      port: POSTGRES_DB.PORT,
      database: POSTGRES_DB.DB_NAME,
      user: POSTGRES_DB.USER,
      password: process.env.POSTGRES_PASSWORD,
    },

    migrations: {
      tableName: 'migrations',
    },
  }
};
