import Joi from 'joi';
import { ORGANIZATION_ROLES } from '../../../constants/organization-roles';
import { OrganizationInvitationModel, OrganizationMemberDTO } from './organizations-members.types';
import usersAttributesConstraints from '../../users/service/users.attributes-constraints';

const member: Record<keyof Omit<OrganizationMemberDTO, 'user'>, Joi.Schema> = {
  role: usersAttributesConstraints.organizationRelation.role,
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};

const invitation: Record<keyof Omit<OrganizationInvitationModel, 'organizationId'>, Joi.Schema> = {
  id: Joi.string().uuid(),
  inviterId: usersAttributesConstraints.user.id,
  email: usersAttributesConstraints.user.email,
  role: Joi.string().valid(...Object.values(ORGANIZATION_ROLES)),
  acceptedAt: Joi.date().iso().allow(null),
  rejectedAt: Joi.date().iso().allow(null),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};

export default {
  member,
  invitation,
};
