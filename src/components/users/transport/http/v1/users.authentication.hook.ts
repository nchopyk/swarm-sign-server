import Errors from '../../../../../errors';
import usersRepository from '../../../service/users.repository';
import jwtService from '../../../../../modules/jwt-service';
import { JWTAuthTokenPayload } from '../../../service/users.types';
import TOKEN_TYPES from '../../../../../constants/token-types';
import usersErrors from '../../../service/users.errors';
import generalErrors from '../../../../general/general.errors';

export default async (req) => {
  const { headers } = req;

  const token = headers.authorization && headers.authorization.split(' ')[1];
  if (!token) throw new Errors.UnauthorizedError(generalErrors.invalidJWTToken());

  const payload = await jwtService.verifyJWT(token) as JWTAuthTokenPayload | null;
  if (!payload) throw new Errors.UnauthorizedError(usersErrors.unauthorized());

  if (payload.tokenType !== TOKEN_TYPES.ACCESS_TOKEN) throw new Errors.UnauthorizedError(generalErrors.invalidJWTTokenType());

  const user = await usersRepository.getModelById(payload.userId);
  if (!user) throw new Errors.UnauthorizedError(usersErrors.unauthorized());

  // eslint-disable-next-line require-atomic-updates
  req.user = user;
};
