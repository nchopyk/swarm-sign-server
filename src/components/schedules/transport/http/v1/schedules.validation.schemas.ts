import Joi from 'joi';
import organizationAttributesConstraints from '../../../../organizations/service/organizations.attributes-constraints';
import schedulesAttributesConstraints from '../../../service/schedules.attributes-constraints';
import collectionQueryParamsProcessor from '../../../../../modules/collection-query-processor';
import { dateOperations, nullableOperations, stringOperations } from '../../../../../modules/collection-query-processor/filter/filter.operations';
import generalAttributesConstraints from '../../../../general/general.attributes-constraints';
import schedulesRepository from '../../../service/schedules.repository';
import playlistsAttributesConstraints from '../../../../playlists/service/playlists.attributes-constraints';
import screensAttributesConstraints from '../../../../screens/service/screens.attributes-constraints';
import { ScheduleCreationAttributes, ScheduleDTO, ScheduleServiceUpdatableAttributes } from '../../../service/schedules.types';
import { FilterColumnConfig } from '../../../../../modules/collection-query-processor/filter/types';
import { PrefixedOrganizationShortDTO } from '../../../../organizations/service/organizations.types';
import { PrefixedShortScreenDTO } from '../../../../screens/service/screens.types';
import { PrefixedShortPlaylistDTO } from '../../../../playlists/service/playlists.types';


const schedulesValidationSchemas = {
  create: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
    body: Joi.object().keys({
      name: schedulesAttributesConstraints.schedule.name.required(),
      notes: schedulesAttributesConstraints.schedule.notes.allow(null),
      playlistId: playlistsAttributesConstraints.playlist.id.required(),
      screenId: screensAttributesConstraints.screen.id.required(),
      start: schedulesAttributesConstraints.schedule.start.required(),
      end: schedulesAttributesConstraints.schedule.end.required(),
    } satisfies Record<keyof Omit<ScheduleCreationAttributes, 'organizationId'>, Joi.Schema>),
  },

  getAllForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
    query: Joi.object().keys({
      sort: collectionQueryParamsProcessor.sort.handleQueryParams({
        columns: Object.keys(schedulesRepository.scheduleDTOColumnMap),
        defaultValue: { createdAt: { order: 'desc' } },
      }),

      where: collectionQueryParamsProcessor.filter.handleQueryParams({
        id: {
          validator: schedulesAttributesConstraints.schedule.id,
          allowedOperations: stringOperations,
        },
        name: {
          validator: schedulesAttributesConstraints.schedule.name,
          allowedOperations: stringOperations,
        },
        notes: {
          validator: schedulesAttributesConstraints.schedule.notes,
          allowedOperations: stringOperations,
        },

        start: {
          validator: schedulesAttributesConstraints.schedule.start,
          allowedOperations: dateOperations,
        },
        end: {
          validator: schedulesAttributesConstraints.schedule.end,
          allowedOperations: dateOperations,
        },

        createdAt: {
          validator: schedulesAttributesConstraints.schedule.createdAt,
          allowedOperations: dateOperations,
        },
        updatedAt: {
          validator: schedulesAttributesConstraints.schedule.updatedAt,
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

        'screen': {
          validator: generalAttributesConstraints.modelRelation,
          allowedOperations: nullableOperations,
        },
        'screen.id': {
          validator: screensAttributesConstraints.screen.id,
          allowedOperations: stringOperations,
        },
        'screen.name': {
          validator: screensAttributesConstraints.screen.name,
          allowedOperations: stringOperations,
        },
        'screen.notes': {
          validator: screensAttributesConstraints.screen.notes,
          allowedOperations: stringOperations,
        },
        'screen.deviceId': {
          validator: screensAttributesConstraints.screen.deviceId,
          allowedOperations: stringOperations,
        },
        'screen.location': {
          validator: screensAttributesConstraints.screen.location,
          allowedOperations: stringOperations,
        },
        'screen.createdAt': {
          validator: screensAttributesConstraints.screen.createdAt,
          allowedOperations: dateOperations,
        },
        'screen.updatedAt': {
          validator: screensAttributesConstraints.screen.updatedAt,
          allowedOperations: dateOperations,
        },


        'playlist': {
          validator: generalAttributesConstraints.modelRelation,
          allowedOperations: nullableOperations,
        },

        'playlist.id': {
          validator: playlistsAttributesConstraints.playlist.id,
          allowedOperations: stringOperations,
        },

        'playlist.name': {
          validator: playlistsAttributesConstraints.playlist.name,
          allowedOperations: stringOperations,
        },

        'playlist.notes': {
          validator: playlistsAttributesConstraints.playlist.notes,
          allowedOperations: stringOperations,
        },

        'playlist.createdAt': {
          validator: playlistsAttributesConstraints.playlist.createdAt,
          allowedOperations: dateOperations,
        },

        'playlist.updatedAt': {
          validator: playlistsAttributesConstraints.playlist.updatedAt,
          allowedOperations: dateOperations,
        },

      } satisfies Record<keyof (ScheduleDTO & PrefixedOrganizationShortDTO & PrefixedShortScreenDTO & PrefixedShortPlaylistDTO), FilterColumnConfig>),
    }),
  },

  getByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      scheduleId: schedulesAttributesConstraints.schedule.id.required(),
    }),
  },

  updateByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      scheduleId: schedulesAttributesConstraints.schedule.id.required(),
    }),
    body: Joi.object().keys({
      name: schedulesAttributesConstraints.schedule.name,
      notes: schedulesAttributesConstraints.schedule.notes,
      playlistId: playlistsAttributesConstraints.playlist.id,
      screenId: screensAttributesConstraints.screen.id,
      start: schedulesAttributesConstraints.schedule.start,
      end: schedulesAttributesConstraints.schedule.end,
    } satisfies Record<keyof ScheduleServiceUpdatableAttributes, Joi.Schema>),
  },

  deleteByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      scheduleId: schedulesAttributesConstraints.schedule.id.required(),
    }),
  },

  getScreenSchedule: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      screenId: screensAttributesConstraints.screen.id.required(),
    }),
  }
};

export default schedulesValidationSchemas;
