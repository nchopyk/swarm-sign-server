import * as dotenv from 'dotenv-safe';
import path from 'path';

dotenv.config({ path: path.resolve(path.join(__dirname, '..', '/.env')), example: path.resolve(path.join(__dirname, '..', '/.env.example')) });

export const NODE_ENV = process.env.NODE_ENV;
export const RUN_ENV = process.env.RUN_ENV;
export const HOST = process.env.HOST;
export const HTTP_PORT = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 5000;
export const WS_PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 5001;
export const LOG_LEVEL = process.env.LOG_LEVEL;
export const PUBLIC_SERVER_URL = process.env.PUBLIC_SERVER_URL;

export const POSTGRES_DB = {
  HOST: process.env.POSTGRES_HOST,
  PORT: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  DB_NAME: process.env.POSTGRES_DB_NAME,
  USER: process.env.POSTGRES_USER,
  PASSWORD: process.env.POSTGRES_PASSWORD,
  SEEDS: {
    ORGANIZATIONS_COUNT: 10,
    USERS_COUNT: 100,
    USERS_PASSWORD: 'password',
    MIN_ADMINS_PER_ORGANIZATION: 3,
  }
};

export const WS_CONNECTION_HEALTHCHECK_INTERVAL = 1000 * 10;

export const PASSWORD_HASH_SALT = 10;
export const CHECKSUM_HASH_SALT = 2;

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET,
  ACCESS_EXPIRES_IN: '24h',
  REFRESH_EXPIRES_IN: '7d',
  EMAIL_VERIFICATION_EXPIRES_IN: '1d',
  PASSWORD_RECOVERY_EXPIRES_IN: '1h',
};

export const MAX_FILE_SIZE = 550 * 1024 * 1024;
export const STATIC_FOLDER_PATH = path.join(process.cwd(), 'static');


export default {
  NODE_ENV,
  RUN_ENV,
  HTTP_PORT,
  WS_PORT,
  HOST,
  LOG_LEVEL,
  POSTGRES_DB,
  PUBLIC_SERVER_URL,
  WS_CONNECTION_HEALTHCHECK_INTERVAL,
  PASSWORD_HASH_SALT,
  CHECKSUM_HASH_SALT,
  JWT_CONFIG,
  STATIC_FOLDER_PATH,
  MAX_FILE_SIZE,
};
