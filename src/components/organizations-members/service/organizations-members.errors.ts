import { ApiError } from '../../../errors/error.types';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { UserId } from '../../users/service/users.types';

const organizationsMembersErrors = {
  organizationNotRelatedToUser: (context: { organizationId: OrganizationId, userId: UserId }): ApiError => ({
    errorType: 'organization.notRelatedToUser',
    message: 'Organization not related to user',
    context
  }),

  relationNotFound: (context: { organizationId: OrganizationId, userId: UserId }): ApiError => ({
    errorType: 'organization.relationNotFound',
    message: 'Organization relation not found',
    context
  }),

};

export default organizationsMembersErrors;
