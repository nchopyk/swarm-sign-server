import Joi from 'joi';
import organizationAttributesConstraints from '../../../../organizations/service/organizations.attributes-constraints';


const screensValidationSchemas = {
  activate: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
    body: Joi.object().keys({
      code: Joi.string().required(),
    }),
  },
};

export default screensValidationSchemas;
