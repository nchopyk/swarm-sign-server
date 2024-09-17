import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config';
import logger from './logger';

class JWTService {

  async generateJWT(payload: object, expiresIn: string | undefined = undefined): Promise<string> {
    const signOptions = expiresIn ? { algorithm: 'HS256', expiresIn } : { algorithm: 'HS256' };

    return await new Promise((resolve, reject) => {
      jwt.sign(payload, JWT_CONFIG.SECRET, signOptions, (err, token) => (err ? reject(err) : resolve(token)));
    });
  }

  async verifyJWT(token: string): Promise<object | null> {
    try {
      return await new Promise((resolve, reject) => {
        jwt.verify(token, JWT_CONFIG.SECRET, (err, decoded) => (err ? reject(err) : resolve(decoded)));
      });
    } catch (err) {
      logger.warn(`[JWTService] JWT verification failed: ${(err as Error).message} for token: ${token}`);
      return null;
    }
  }
}

export default new JWTService();
