import schedulesValidationSchemas from './schedules.validation.schemas';
import transmittersTransmittersValidationSchemas from './schedules.response.schemas';
import controller from './schedules.controller';
import userAuthenticationHook from '../../../../users/transport/http/v1/users.authentication.hook';
import organizationsRoleAccessControlHook from '../../../../organizations/transport/http/v1/organizations.role-access-control.hook';
import { ORGANIZATION_ROLES } from '../../../../../constants/organization-roles';
import { FastifyInstance, FastifyPluginOptions, FastifyPluginCallback } from 'fastify';


const router: FastifyPluginCallback = (fastify: FastifyInstance, opts: FastifyPluginOptions, done) => {
  fastify.addHook('onRequest', userAuthenticationHook);

  fastify.post('organizations/:organizationId/schedules', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: schedulesValidationSchemas.create.params,
      body: schedulesValidationSchemas.create.body,
      response: transmittersTransmittersValidationSchemas.create,
    },
  }, controller.create);

  fastify.get('organizations/:organizationId/schedules', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: schedulesValidationSchemas.getAllForOrganization.params,
      querystring: schedulesValidationSchemas.getAllForOrganization.query,
      response: transmittersTransmittersValidationSchemas.getAllForOrganization,
    },
  }, controller.getAllForOrganization);

  fastify.get('organizations/:organizationId/schedules/:scheduleId', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: schedulesValidationSchemas.getByIdForOrganization.params,
      response: transmittersTransmittersValidationSchemas.getByIdForOrganization,
    },
  }, controller.getByIdForOrganization);

  fastify.patch('organizations/:organizationId/schedules/:scheduleId', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: schedulesValidationSchemas.updateByIdForOrganization.params,
      body: schedulesValidationSchemas.updateByIdForOrganization.body,
      response: transmittersTransmittersValidationSchemas.updateByIdForOrganization,
    },
  }, controller.updateByIdForOrganization);

  fastify.delete('organizations/:organizationId/schedules/:scheduleId', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: schedulesValidationSchemas.deleteByIdForOrganization.params,
      response: transmittersTransmittersValidationSchemas.deleteByIdForOrganization,
    },
  }, controller.deleteByIdForOrganization);

  fastify.get('organizations/:organizationId/screens/:screenId/schedule', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: schedulesValidationSchemas.getScreenSchedule.params,
      response: transmittersTransmittersValidationSchemas.getScreenSchedule,
    }
  }, controller.getScreenSchedule);

  done();
};


export default router;
