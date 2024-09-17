// this hook is used to check if the user has enough rights to perform change another user's data

import Errors from '../../../../../errors';
import generalErrors from '../../../../general/general.errors';
import usersErrors from '../../../../users/service/users.errors';

export default async (req) => {
  const currentUser = req.user;
  if (!currentUser) throw new Errors.InternalError(generalErrors.propertyNotFoundInRequestObject({ property: 'user' }));

  const userIdToBeChanged = req.params.userId || req.body.userId;
  if (!userIdToBeChanged) throw new Errors.InternalError(generalErrors.propertyNotFoundInRequestObject({ property: 'userId' }));

  if (currentUser.id === userIdToBeChanged) {
    throw new Errors.ForbiddenError(usersErrors.cannotPerformActionOnYourself({ userId: currentUser.id }));
  }
};
