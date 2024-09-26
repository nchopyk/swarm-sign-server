import playlistsValidationSchemas from './playlists.validation.schemas';
import transmittersTransmittersValidationSchemas from './playlists.response.schemas';
import controller from './playlists.controller';
import userAuthenticationHook from '../../../../users/transport/http/v1/users.authentication.hook';
import organizationsRoleAccessControlHook from '../../../../organizations/transport/http/v1/organizations.role-access-control.hook';
import { ORGANIZATION_ROLES } from '../../../../../constants/organization-roles';
import { FastifyInstance, FastifyPluginOptions, FastifyPluginCallback } from 'fastify';


const router: FastifyPluginCallback = (fastify: FastifyInstance, opts: FastifyPluginOptions, done) => {
  fastify.addHook('onRequest', userAuthenticationHook);

  fastify.post('organizations/:organizationId/playlists', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: playlistsValidationSchemas.create.params,
      body: playlistsValidationSchemas.create.body,
      response: transmittersTransmittersValidationSchemas.create,
    },
  }, controller.create);

  fastify.get('organizations/:organizationId/playlists', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: playlistsValidationSchemas.getAllForOrganization.params,
      querystring: playlistsValidationSchemas.getAllForOrganization.query,
      response: transmittersTransmittersValidationSchemas.getAllForOrganization,
    },
  }, controller.getAllForOrganization);

  fastify.get('organizations/:organizationId/playlists/:playlistId', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: playlistsValidationSchemas.getByIdForOrganization.params,
      response: transmittersTransmittersValidationSchemas.getByIdForOrganization,
    },
  }, controller.getByIdForOrganization);

  fastify.patch('organizations/:organizationId/playlists/:playlistId', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: playlistsValidationSchemas.updateByIdForOrganization.params,
      body: playlistsValidationSchemas.updateByIdForOrganization.body,
      response: transmittersTransmittersValidationSchemas.updateByIdForOrganization,
    },
  }, controller.updateByIdForOrganization);

  fastify.delete('organizations/:organizationId/playlists/:playlistId', {
    preHandler: organizationsRoleAccessControlHook([ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN]),
    schema: {
      params: playlistsValidationSchemas.deleteByIdForOrganization.params,
      response: transmittersTransmittersValidationSchemas.deleteByIdForOrganization,
    },
  }, controller.deleteByIdForOrganization);

  fastify.get('organizations/:organizationId/playlists/:playlistId/medias', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: playlistsValidationSchemas.getPlaylistMedias.params,
      response: transmittersTransmittersValidationSchemas.getPlaylistMedias,
    },
  }, controller.getPlaylistMedias);

  fastify.post('organizations/:organizationId/playlists/:playlistId/medias/add', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: playlistsValidationSchemas.addPlaylistMedias.params,
      body: playlistsValidationSchemas.addPlaylistMedias.body,
      response: transmittersTransmittersValidationSchemas.addPlaylistMedias,
    },
  }, controller.addPlaylistMedias);

  fastify.post('organizations/:organizationId/playlists/:playlistId/medias/remove', {
    preHandler: organizationsRoleAccessControlHook(Object.values(ORGANIZATION_ROLES)),
    schema: {
      params: playlistsValidationSchemas.removePlaylistMedias.params,
      body: playlistsValidationSchemas.removePlaylistMedias.body,
      response: transmittersTransmittersValidationSchemas.removePlaylistMedias,
    },
  }, controller.removePlaylistMedias);

  done();
};


export default router;
