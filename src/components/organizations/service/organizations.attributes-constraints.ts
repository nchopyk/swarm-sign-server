import Joi from 'joi';
import { OrganizationModel } from './organizations.types';

const organization: Record<keyof OrganizationModel, Joi.Schema> = {
  id: Joi.string().uuid(),
  name: Joi.string().min(1).max(255),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};

export default {
  organization,
};
