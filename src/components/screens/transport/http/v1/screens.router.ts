import { FastifyInstance, FastifyPluginOptions, FastifyPluginCallback } from 'fastify';
import screensValidationSchemas from './screens.validation.schemas';
import transmittersTransmittersValidationSchemas from './screens.response.schemas';
import controller from './screens.controller';
import userAuthenticationHook from '../../../../users/transport/http/v1/users.authentication.hook';
import organizationsRoleAccessControlHook from '../../../../organizations/transport/http/v1/organizations.role-access-control.hook';
import { ORGANIZATION_ROLES } from '../../../../../constants/organization-roles';


const router: FastifyPluginCallback = (fastify: FastifyInstance, opts: FastifyPluginOptions, done) => {
  fastify.addHook('onRequest', userAuthenticationHook);

  fastify.post('organizations/:organizationId/screens/activate', {
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
