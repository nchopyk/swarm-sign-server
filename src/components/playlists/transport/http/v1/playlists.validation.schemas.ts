import Joi from 'joi';
import organizationAttributesConstraints from '../../../../organizations/service/organizations.attributes-constraints';
import playlistsAttributesConstraints from '../../../service/playlists.attributes-constraints';
import collectionQueryParamsProcessor from '../../../../../modules/collection-query-processor';
import generalAttributesConstraints from '../../../../general/general.attributes-constraints';
import playlistsRepository from '../../../service/playlists.repository';
import mediasAttributesConstraints from '../../../../medias/service/medias.attributes-constraints';
import { dateOperations, nullableOperations, stringOperations } from '../../../../../modules/collection-query-processor/filter/filter.operations';
import { FilterColumnConfig } from '../../../../../modules/collection-query-processor/filter/types';
import { PrefixedOrganizationShortDTO } from '../../../../organizations/service/organizations.types';
import { PlaylistServiceCreationAttributes, PlaylistDTO, PlaylistServiceUpdatableAttributes } from '../../../service/playlists.types';
import { MediaId } from '../../../../medias/service/medias.types';


const playlistsValidationSchemas = {
  create: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
    body: Joi.object().keys({
      name: playlistsAttributesConstraints.playlist.name.required(),
      notes: playlistsAttributesConstraints.playlist.notes.allow(null),
      medias: Joi.array().items(mediasAttributesConstraints.media.id).required(),
    } satisfies Record<keyof Omit<PlaylistServiceCreationAttributes, 'medias'> & { medias: MediaId[] }, Joi.Schema>),
  },

  getAllForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
    query: Joi.object().keys({
      page: collectionQueryParamsProcessor.pagination.handleQueryParams({
        defaultValue: { number: 1, size: 20 },
      }),

      sort: collectionQueryParamsProcessor.sort.handleQueryParams({
        columns: Object.keys(playlistsRepository.playlistDTOColumnMap),
        defaultValue: { createdAt: { order: 'desc' } },
      }),

      where: collectionQueryParamsProcessor.filter.handleQueryParams({
        id: {
          validator: playlistsAttributesConstraints.playlist.id,
          allowedOperations: stringOperations,
        },
        name: {
          validator: playlistsAttributesConstraints.playlist.name,
          allowedOperations: stringOperations,
        },
        notes: {
          validator: playlistsAttributesConstraints.playlist.notes,
          allowedOperations: stringOperations,
        },
        createdAt: {
          validator: playlistsAttributesConstraints.playlist.createdAt,
          allowedOperations: dateOperations,
        },
        updatedAt: {
          validator: playlistsAttributesConstraints.playlist.updatedAt,
          allowedOperations: dateOperations,
        },

        'organization': {
          validator: generalAttributesConstraints.modelRelation,
          allowedOperations: nullableOperations,
        },

        'organization.id': {
          validator: organizationAttributesConstraints.organization.id,
          allowedOperations: stringOperations,
        },

        'organization.name': {
          validator: organizationAttributesConstraints.organization.name,
          allowedOperations: stringOperations,
        },

        'organization.createdAt': {
          validator: organizationAttributesConstraints.organization.createdAt,
          allowedOperations: dateOperations,
        },

        'organization.updatedAt': {
          validator: organizationAttributesConstraints.organization.updatedAt,
          allowedOperations: dateOperations,
        },
      } satisfies Record<keyof (PlaylistDTO & PrefixedOrganizationShortDTO), FilterColumnConfig>),
    }),
  },

  getByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      playlistId: playlistsAttributesConstraints.playlist.id.required(),
    }),
  },

  updateByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      playlistId: playlistsAttributesConstraints.playlist.id.required(),
    }),
    body: Joi.object().keys({
      name: playlistsAttributesConstraints.playlist.name,
      notes: playlistsAttributesConstraints.playlist.notes,
    } satisfies Record<keyof PlaylistServiceUpdatableAttributes, Joi.Schema>),
  },

  deleteByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      playlistId: playlistsAttributesConstraints.playlist.id.required(),
    }),
  },

  activate: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
    body: Joi.object().keys({
      code: Joi.string().required(),
    }),
  },
};

export default playlistsValidationSchemas;
