import organizationsValidationSchemas from './organizations.validation.schemas';
import organizationsController from './organizations.controller';
import organizationsResponsesSchemas from './organizations.response.schemas';
import userAuthenticationHook from '../../../../users/transport/http/v1/users.authentication.hook';
import organizationsRoleAccessControlHook from './organizations.role-access-control.hook';
import { ORGANIZATION_ROLES } from '../../../../../constants/organization-roles';
import { FastifyInstance, FastifyPluginOptions, FastifyPluginCallback } from 'fastify';


const router: FastifyPluginCallback = (fastify: FastifyInstance, opts: FastifyPluginOptions, done) => {
  fastify.addHook('onRequest', userAuthenticationHook);

  fastify.get('organizations/:organizationId', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: organizationsValidationSchemas.getById.params,
      response: organizationsResponsesSchemas.getById
    }
  }, organizationsController.getById);

  fastify.patch('organizations/:organizationId', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: organizationsValidationSchemas.update.params,
      body: organizationsValidationSchemas.update.body,
      response: organizationsResponsesSchemas.update
    }
  }, organizationsController.update);

  fastify.delete('organizations/:organizationId', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER]),
    schema: {
      params: organizationsValidationSchemas.delete.params,
      response: organizationsResponsesSchemas.delete
    }
  }, organizationsController.delete);

  done();
};

export default router;

