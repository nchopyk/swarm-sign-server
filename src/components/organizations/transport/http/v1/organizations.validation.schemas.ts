import Joi from 'joi';
import organizationAttributesConstraints from '../../../service/organizations.attributes-constraints';
import { OrganizationUpdatableAttributes } from '../../../service/organizations.types';


const validationSchemas = {
  getById: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
  },

  update: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),

    body: Joi.object().keys({
      name: organizationAttributesConstraints.organization.name,
    } satisfies Record<keyof OrganizationUpdatableAttributes, Joi.Schema>),
  },

  delete: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
  },
};


export default validationSchemas;
