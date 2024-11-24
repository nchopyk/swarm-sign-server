import Joi from 'joi';
import organizationAttributesConstraints from '../../../../organizations/service/organizations.attributes-constraints';
import { ScreenCreationAttributes, ScreenDTO, ScreenServiceUpdatableAttributes } from '../../../service/screens.types';
import screensAttributesConstraints from '../../../service/screens.attributes-constraints';
import collectionQueryParamsProcessor from '../../../../../modules/collection-query-processor';
import { dateOperations, nullableOperations, stringOperations } from '../../../../../modules/collection-query-processor/filter/filter.operations';
import generalAttributesConstraints from '../../../../general/general.attributes-constraints';
import { FilterColumnConfig } from '../../../../../modules/collection-query-processor/filter/types';
import { PrefixedOrganizationShortDTO } from '../../../../organizations/service/organizations.types';
import screensRepository from '../../../service/screens.repository';


const screensValidationSchemas = {
  create: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
    body: Joi.object().keys({
      name: screensAttributesConstraints.screen.name.required(),
      notes: screensAttributesConstraints.screen.notes.allow(null),
      location: screensAttributesConstraints.screen.location.allow(null),
    } satisfies Record<keyof Omit<ScreenCreationAttributes, 'organizationId'>, Joi.Schema>),
  },

  getAllForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
    query: Joi.object().keys({
      sort: collectionQueryParamsProcessor.sort.handleQueryParams({
        columns: Object.keys(screensRepository.screenDTOColumnMap),
        defaultValue: { createdAt: { order: 'desc' } },
      }),

      where: collectionQueryParamsProcessor.filter.handleQueryParams({
        id: {
          validator: screensAttributesConstraints.screen.id,
          allowedOperations: stringOperations,
        },
        name: {
          validator: screensAttributesConstraints.screen.name,
          allowedOperations: stringOperations,
        },
        notes: {
          validator: screensAttributesConstraints.screen.notes,
          allowedOperations: stringOperations,
        },
        location: {
          validator: screensAttributesConstraints.screen.location,
          allowedOperations: stringOperations,
        },
        deviceId: {
          validator: screensAttributesConstraints.screen.deviceId,
          allowedOperations: stringOperations,
        },
        createdAt: {
          validator: screensAttributesConstraints.screen.createdAt,
          allowedOperations: dateOperations,
        },
        updatedAt: {
          validator: screensAttributesConstraints.screen.updatedAt,
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
      } satisfies Record<keyof (ScreenDTO & PrefixedOrganizationShortDTO), FilterColumnConfig>),
    }),
  },

  getByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      screenId: screensAttributesConstraints.screen.id.required(),
    }),
  },

  updateByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      screenId: screensAttributesConstraints.screen.id.required(),
    }),
    body: Joi.object().keys({
      name: screensAttributesConstraints.screen.name,
      notes: screensAttributesConstraints.screen.notes,
      location: screensAttributesConstraints.screen.location,
    } satisfies Record<keyof ScreenServiceUpdatableAttributes, Joi.Schema>),
  },

  deleteByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      screenId: screensAttributesConstraints.screen.id.required(),
    }),
  },

  activate: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      screenId: screensAttributesConstraints.screen.id.required(),
    }),
    body: Joi.object().keys({
      code: Joi.string().required(),
    }),
  },

  deactivate: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      screenId: screensAttributesConstraints.screen.id.required(),
    }),
  }
};

export default screensValidationSchemas;
