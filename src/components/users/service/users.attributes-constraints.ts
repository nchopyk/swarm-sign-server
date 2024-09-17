import Joi from 'joi';
import LANGUAGES from '../../../constants/languages';
import Units from '../../../constants/units';
import { UserModel, UserOrganizationRelationModel } from './users.types';
import { ORGANIZATION_ROLES } from '../../../constants/organization-roles';

const user: Record<keyof UserModel, Joi.Schema> = {
  id: Joi.string().uuid(),
  email: Joi.string().email().max(255),
  password: Joi.string().min(6).max(255),
  firstName: Joi.string().min(1).max(255),
  lastName: Joi.string().min(1).max(255),
  avatarUrl: Joi.string().uri().min(1).max(255).allow(null),
  language: Joi.string().valid(...Object.values(LANGUAGES)),
  temperatureUnit: Joi.string().valid(...Object.values(Units.TEMPERATURE)),
  distanceUnit: Joi.string().valid(...Object.values(Units.DISTANCE)),
  volumeUnit: Joi.string().valid(...Object.values(Units.VOLUME)),
  twoFactorAuthEnabled: Joi.boolean(),
  emailVerifiedAt: Joi.date().iso().allow(null),
  accountBlockedAt: Joi.date().iso().allow(null),
  accountBlockedReason: Joi.string().min(1).max(255).allow(null),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};

const organizationRelation: Record<keyof Omit<UserOrganizationRelationModel, 'organizationId' | 'userId'>, Joi.Schema> = {
  role: Joi.string().valid(...Object.values(ORGANIZATION_ROLES)),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};

export default {
  user,
  organizationRelation,
};
