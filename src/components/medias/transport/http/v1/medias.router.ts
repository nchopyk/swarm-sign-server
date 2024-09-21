import mediasValidationSchemas from './medias.validation.schemas';
import transmittersTransmittersValidationSchemas from './medias.response.schemas';
import controller from './medias.controller';
import userAuthenticationHook from '../../../../users/transport/http/v1/users.authentication.hook';
import organizationsRoleAccessControlHook from '../../../../organizations/transport/http/v1/organizations.role-access-control.hook';
import { ORGANIZATION_ROLES } from '../../../../../constants/organization-roles';
import { FastifyInstance, FastifyPluginOptions, FastifyPluginCallback } from 'fastify';


const router: FastifyPluginCallback = (fastify: FastifyInstance, opts: FastifyPluginOptions, done) => {
  fastify.addHook('onRequest', userAuthenticationHook);

  fastify.post('organizations/:organizationId/medias', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: mediasValidationSchemas.create.params,
      body: mediasValidationSchemas.create.body,
      response: transmittersTransmittersValidationSchemas.create,
    },
  }, controller.create);

  fastify.get('organizations/:organizationId/medias', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: mediasValidationSchemas.getAllForOrganization.params,
      querystring: mediasValidationSchemas.getAllForOrganization.query,
      response: transmittersTransmittersValidationSchemas.getAllForOrganization,
    },
  }, controller.getAllForOrganization);

  fastify.get('organizations/:organizationId/medias/:mediaId', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: mediasValidationSchemas.getByIdForOrganization.params,
      response: transmittersTransmittersValidationSchemas.getByIdForOrganization,
    },
  }, controller.getByIdForOrganization);

  fastify.patch('organizations/:organizationId/medias/:mediaId', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: mediasValidationSchemas.updateByIdForOrganization.params,
      body: mediasValidationSchemas.updateByIdForOrganization.body,
      response: transmittersTransmittersValidationSchemas.updateByIdForOrganization,
    },
  }, controller.updateByIdForOrganization);

  fastify.delete('organizations/:organizationId/medias/:mediaId', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: mediasValidationSchemas.deleteByIdForOrganization.params,
      response: transmittersTransmittersValidationSchemas.deleteByIdForOrganization,
    },
  }, controller.deleteByIdForOrganization);

  done();
};


export default router;
