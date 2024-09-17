import Joi from 'joi';
import { OrganizationMemberDTO } from './organizations-members.types';
import usersAttributesConstraints from '../../users/service/users.attributes-constraints';

const member: Record<keyof Omit<OrganizationMemberDTO, 'user'>, Joi.Schema> = {
  role: usersAttributesConstraints.organizationRelation.role,
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};

export default {
  member,
};
