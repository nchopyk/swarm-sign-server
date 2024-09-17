import { FastifyInstance, FastifyPluginOptions, FastifyPluginCallback } from 'fastify';
import validationSchemas from './organizations-members.validation.schemas';
import responsesSchemas from './organizations-members.response.schemas';
import controller from './organizations-members.controller';
import userAuthenticationHook from '../../../../users/transport/http/v1/users.authentication.hook';
import organizationsRoleAccessControlHook from '../../../../organizations/transport/http/v1/organizations.role-access-control.hook';
import organizationsRolePrivilegeControlHook from '../../../../organizations/transport/http/v1/organizations.role-privilege-control.hook';
import { ORGANIZATION_ROLES } from '../../../../../constants/organization-roles';
import userSelfActionsBlockerHook from '../../../../users/transport/http/v1/users.self-actions-blocker.hook';

const router: FastifyPluginCallback = (fastify: FastifyInstance, opts: FastifyPluginOptions, done) => {
  fastify.addHook('onRequest', userAuthenticationHook);

  fastify.get('organizations/:organizationId/members', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: validationSchemas.getAllOrganizationMembers.params,
      querystring: validationSchemas.getAllOrganizationMembers.query,
      response: responsesSchemas.getAllOrganizationMembers
    }
  }, controller.getAllMembers);

  fastify.patch('organizations/:organizationId/members/:userId', {
    preHandler: [
      organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
      organizationsRolePrivilegeControlHook,
      userSelfActionsBlockerHook
    ],
    schema: {
      params: validationSchemas.updateOrganizationMemberById.params,
      body: validationSchemas.updateOrganizationMemberById.body,
      response: responsesSchemas.updateOrganizationMemberById
    }
  }, controller.updateMember);

  done();

};

export default router;

