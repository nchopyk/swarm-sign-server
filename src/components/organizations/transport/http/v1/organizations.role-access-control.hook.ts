import Errors from '../../../../../errors';
import generalErrors from '../../../../general/general.errors';
import usersErrors from '../../../../users/service/users.errors';
import usersRepository from '../../../../users/service/users.repository';
import { OrganizationRoleType } from '../../../../../constants/organization-roles';

export default (accessForRoles: Array<OrganizationRoleType>) => async (req) => {
  const user = req.user;
  if (!user) {
    throw new Errors.InternalError(generalErrors.propertyNotFoundInRequestObject({ property: 'user' }));
  }

  const organizationId = req.params.organizationId || req.body.organizationId;
  if (!organizationId) {
    throw new Errors.InternalError(generalErrors.propertyNotFoundInRequestObject({ property: 'organizationId' }));
  }

  const userOrganization = await usersRepository.getUserOrganizationRelation({ userId: user.id, organizationId });
  if (!userOrganization) {
    throw new Errors.ForbiddenError(usersErrors.userNotBelongsToOrganization({ userId: user.id, organizationId }));
  }

  const userOrganizationRole = userOrganization.role;
  if (!accessForRoles.includes(userOrganizationRole)) {
    throw new Errors.ForbiddenError(usersErrors.notPermissionForThisAction({ userId: user.id }));
  }
};
