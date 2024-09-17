import { ResponseAttributes } from '../../../../general/general.types';
import { OrganizationInvitationModel, OrganizationMemberDTO } from '../../../service/organizations-members.types';

const member: ResponseAttributes<Omit<OrganizationMemberDTO, 'user'>> = {
  role: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

const invitation: ResponseAttributes<Omit<OrganizationInvitationModel, 'organizationId'>> = {
  id: { type: 'string' },
  inviterId: { type: 'string' },
  email: { type: 'string' },
  role: { type: 'string' },
  acceptedAt: { type: 'string', format: 'date-time', nullable: true },
  rejectedAt: { type: 'string', format: 'date-time', nullable: true },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

export default {
  member,
  invitation,
};
