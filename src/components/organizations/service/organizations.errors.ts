import { ApiError } from '../../../errors/error.types';
import { OrganizationId } from './organizations.types';


const organizationsErrors = {
  withSuchIdNotFound: (context: { organizationId: OrganizationId }): ApiError => ({
    errorType: 'organization.withSuchIdNotFound',
    message: 'Organization not found',
    context
  }),
};

export default organizationsErrors;
