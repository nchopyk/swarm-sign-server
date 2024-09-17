import { ResponseAttributes } from '../../../../general/general.types';
import { UserModel, UserOrganizationRelationModel } from '../../../service/users.types';

const user: ResponseAttributes<Omit<UserModel, 'password'>> = {
  id: { type: 'string' },
  email: { type: 'string' },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  avatarUrl: { type: 'string', nullable: true },
  language: { type: 'string', nullable: true },
  accountBlockedAt: { type: 'string', nullable: true, format: 'date-time' },
  accountBlockedReason: { type: 'string', nullable: true },
  emailVerifiedAt: { type: 'string', nullable: true, format: 'date-time' },
  twoFactorAuthEnabled: { type: 'boolean', nullable: true },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

const organizationRelation: ResponseAttributes<Omit<UserOrganizationRelationModel, 'userId' | 'organizationId'>> = {
  role: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

export default {
  user,
  organizationRelation,
};
