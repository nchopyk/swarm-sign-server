import { ResponseAttributes } from '../../../../general/general.types';
import { OrganizationModel } from '../../../service/organizations.types';

const organization: ResponseAttributes<OrganizationModel> = {
  id: { type: 'string' },
  name: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

export default {
  organization,
};
