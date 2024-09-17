import { FastifyInstance, FastifyPluginOptions, FastifyPluginCallback } from 'fastify';
import validationSchemas from './users.validation.schemas';
import responsesSchemas from './users.response.schemas';
import controller from './users.controller';
import userAuthenticationHook from './users.authentication.hook';


const router: FastifyPluginCallback = (fastify: FastifyInstance, opts: FastifyPluginOptions, done) => {
  fastify.post('users/sign-up', {
    schema: {
      body: validationSchemas.signUp.body,
      response: responsesSchemas.signUp
    }
  }, controller.signUp);

  fastify.post('users/login', {
    schema: {
      body: validationSchemas.login.body,
      response: responsesSchemas.login
    }
  }, controller.login);

  fastify.post('users/refresh-token', {
    schema: {
      body: validationSchemas.refreshToken.body,
      response: responsesSchemas.refreshToken
    }
  }, controller.refreshToken);


  fastify.get('users/me', {
    onRequest: userAuthenticationHook,
    schema: {
      response: responsesSchemas.getCurrentUser
    }
  }, controller.getCurrentUser);

  fastify.patch('users/me', {
    onRequest: userAuthenticationHook,
    schema: {
      body: validationSchemas.updateCurrentUser.body,
      response: responsesSchemas.updateCurrentUser
    }
  }, controller.updateCurrentUser);

  fastify.delete('users/me', {
    onRequest: userAuthenticationHook,
    schema: {
      response: responsesSchemas.deleteCurrentUser
    }
  }, controller.deleteCurrentUser);

  fastify.post('users/me/organizations', {
    onRequest: userAuthenticationHook,
    schema: {
      body: validationSchemas.createUserOrganization.body,
      response: responsesSchemas.createUserOrganization
    }
  }, controller.createUserOrganization);

  fastify.get('users/me/organizations', {
    onRequest: userAuthenticationHook,
    schema: {
      querystring: validationSchemas.getAllUserOrganizationsWithPagination.query,
      response: responsesSchemas.getAllUserOrganizationsWithPagination
    }
  }, controller.getAllUserOrganizationsWithPagination);

  fastify.get('users/me/organizations/:organizationId', {
    onRequest: userAuthenticationHook,
    schema: {
      params: validationSchemas.getUserOrganizationById.params,
      response: responsesSchemas.getUserOrganizationById
    }
  }, controller.getUserOrganizationById);

  fastify.delete('users/me/organizations/:organizationId', {
    onRequest: userAuthenticationHook,
    schema: {
      params: validationSchemas.leaveOrganization.params,
      response: responsesSchemas.leaveOrganization
    }
  }, controller.leaveOrganization);


  done();
};


export default router;

