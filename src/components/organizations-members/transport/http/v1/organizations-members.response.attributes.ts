import { ResponseAttributes } from '../../../../general/general.types';
import { OrganizationMemberDTO } from '../../../service/organizations-members.types';

const member: ResponseAttributes<Omit<OrganizationMemberDTO, 'user'>> = {
  role: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

export default {
  member,
};
