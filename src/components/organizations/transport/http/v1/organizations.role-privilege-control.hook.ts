// this hook is used to check if the user has enough rights to perform change another user's data

import Errors from '../../../../../errors';
import generalErrors from '../../../../general/general.errors';
import usersErrors from '../../../../users/service/users.errors';
import { ORGANIZATION_ROLES } from '../../../../../constants/organization-roles';
import usersRepository from '../../../../users/service/users.repository';

const ROLE_HIERARCHY = {
  [ORGANIZATION_ROLES.OWNER]: 3,
  [ORGANIZATION_ROLES.ADMIN]: 2,
  [ORGANIZATION_ROLES.MEMBER]: 1,
};

export default async (req) => {
  const currentUser = req.user;
  if (!currentUser) throw new Errors.InternalError(generalErrors.propertyNotFoundInRequestObject({ property: 'user' }));

  const organizationId = req.params.organizationId || req.body.organizationId;
  if (!organizationId) throw new Errors.InternalError(generalErrors.propertyNotFoundInRequestObject({ property: 'organizationId' }));

  const userIdToBeChanged = req.params.userId || req.body.userId;
  if (!userIdToBeChanged) throw new Errors.InternalError(generalErrors.propertyNotFoundInRequestObject({ property: 'userId' }));

  const [currentUserOrganizationRelation, userToBeChangedOrganizationRelation] = await Promise.all([
    usersRepository.getUserOrganizationRelation({ userId: currentUser.id, organizationId }),
    usersRepository.getUserOrganizationRelation({ userId: userIdToBeChanged, organizationId }),
  ]);

  if (!currentUserOrganizationRelation) throw new Errors.ForbiddenError(usersErrors.userNotBelongsToOrganization({ userId: currentUser.id, organizationId }));
  if (!userToBeChangedOrganizationRelation) throw new Errors.ForbiddenError(usersErrors.userNotBelongsToOrganization({ userId: userIdToBeChanged, organizationId }));

  if (ROLE_HIERARCHY[currentUserOrganizationRelation.role] < ROLE_HIERARCHY[userToBeChangedOrganizationRelation.role]) {
    throw new Errors.ForbiddenError(usersErrors.notPermissionForThisAction({ userId: currentUser.id }));
  }
};
