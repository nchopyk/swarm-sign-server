import bcrypt from 'bcryptjs';
import { PASSWORD_HASH_SALT } from '../../../config';
import * as crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(PASSWORD_HASH_SALT);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hashedPassword: string) => bcrypt.compare(password, hashedPassword);

export const generateChecksum = async (data: string): Promise<string> => {
  const hash = crypto.createHash('sha256');
  hash.update(data);

  return hash.digest('hex');
};

export const generateAuthCodeFromUUID = (uuid: string): string => uuid.replace(/-/g, '');

export const getUUIDFromAuthCode = (code: string): string => code.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');

export default {
  hashPassword,
  comparePasswords,
  generateChecksum,
  generateAuthCodeFromUUID,
  getUUIDFromAuthCode,
};
