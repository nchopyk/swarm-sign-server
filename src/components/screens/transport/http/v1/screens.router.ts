import screensValidationSchemas from './screens.validation.schemas';
import transmittersTransmittersValidationSchemas from './screens.response.schemas';
import controller from './screens.controller';
import userAuthenticationHook from '../../../../users/transport/http/v1/users.authentication.hook';
import organizationsRoleAccessControlHook from '../../../../organizations/transport/http/v1/organizations.role-access-control.hook';
import { ORGANIZATION_ROLES } from '../../../../../constants/organization-roles';
import { FastifyInstance, FastifyPluginOptions, FastifyPluginCallback } from 'fastify';


const router: FastifyPluginCallback = (fastify: FastifyInstance, opts: FastifyPluginOptions, done) => {
  fastify.addHook('onRequest', userAuthenticationHook);

  fastify.post('organizations/:organizationId/screens', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: screensValidationSchemas.create.params,
      body: screensValidationSchemas.create.body,
      response: transmittersTransmittersValidationSchemas.create,
    },
  }, controller.create);

  fastify.get('organizations/:organizationId/screens', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: screensValidationSchemas.getAllForOrganization.params,
      querystring: screensValidationSchemas.getAllForOrganization.query,
      response: transmittersTransmittersValidationSchemas.getAllForOrganization,
    },
  }, controller.getAllForOrganization);

  fastify.get('organizations/:organizationId/screens/:screenId', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: screensValidationSchemas.getByIdForOrganization.params,
      response: transmittersTransmittersValidationSchemas.getByIdForOrganization,
    },
  }, controller.getByIdForOrganization);

  fastify.patch('organizations/:organizationId/screens/:screenId', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: screensValidationSchemas.updateByIdForOrganization.params,
      body: screensValidationSchemas.updateByIdForOrganization.body,
      response: transmittersTransmittersValidationSchemas.updateByIdForOrganization,
    },
  }, controller.updateByIdForOrganization);

  fastify.delete('organizations/:organizationId/screens/:screenId', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: screensValidationSchemas.deleteByIdForOrganization.params,
      response: transmittersTransmittersValidationSchemas.deleteByIdForOrganization,
    },
  }, controller.deleteByIdForOrganization);

  fastify.post('organizations/:organizationId/screens/:screenId/activate', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: screensValidationSchemas.activate.params,
      body: screensValidationSchemas.activate.body,
      response: transmittersTransmittersValidationSchemas.activate,
    },
  }, controller.activate);

  done();
};


export default router;
