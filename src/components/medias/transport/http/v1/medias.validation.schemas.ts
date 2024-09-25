import Joi from 'joi';
import mediasRepository from '../../../service/medias.repository';
import organizationAttributesConstraints from '../../../../organizations/service/organizations.attributes-constraints';
import mediasAttributesConstraints from '../../../service/medias.attributes-constraints';
import generalAttributesConstraints from '../../../../general/general.attributes-constraints';
import collectionQueryParamsProcessor from '../../../../../modules/collection-query-processor';
import { dateOperations, nullableOperations, stringOperations } from '../../../../../modules/collection-query-processor/filter/filter.operations';
import { FilterColumnConfig } from '../../../../../modules/collection-query-processor/filter/types';
import { PrefixedOrganizationShortDTO } from '../../../../organizations/service/organizations.types';
import { MediaDTO, MediaServiceCreationAttributes, MediaServiceUpdatableAttributes } from '../../../service/medias.types';


const mediasValidationSchemas = {
  create: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
    body: Joi.object().keys({
      name: mediasAttributesConstraints.media.name.required(),
      notes: mediasAttributesConstraints.media.notes.allow(null),
      type: mediasAttributesConstraints.media.type.required(),
      mediaFile: Joi.object().keys({
        filename: mediasAttributesConstraints.file.filename.required(),
        mimetype: mediasAttributesConstraints.file.mimetype.required(),
        encoding: mediasAttributesConstraints.file.encoding.required(),
        size: mediasAttributesConstraints.file.size.required(),
      }).required(),
    } satisfies Record<keyof Omit<MediaServiceCreationAttributes, 'buffer'>, Joi.Schema>),
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
        columns: Object.keys(mediasRepository.mediaDTOColumnMap),
        defaultValue: { createdAt: { order: 'desc' } },
      }),

      where: collectionQueryParamsProcessor.filter.handleQueryParams({
        id: {
          validator: mediasAttributesConstraints.media.id,
          allowedOperations: stringOperations,
        },
        name: {
          validator: mediasAttributesConstraints.media.name,
          allowedOperations: stringOperations,
        },
        notes: {
          validator: mediasAttributesConstraints.media.notes,
          allowedOperations: stringOperations,
        },
        content: {
          validator: mediasAttributesConstraints.media.content,
          allowedOperations: stringOperations,
        },
        type: {
          validator: mediasAttributesConstraints.media.type,
          allowedOperations: stringOperations,
        },
        duration: {
          validator: mediasAttributesConstraints.media.duration,
          allowedOperations: nullableOperations,
        },
        width: {
          validator: mediasAttributesConstraints.media.width,
          allowedOperations: nullableOperations,
        },
        height: {
          validator: mediasAttributesConstraints.media.height,
          allowedOperations: nullableOperations,
        },
        mimeType: {
          validator: mediasAttributesConstraints.media.mimeType,
          allowedOperations: stringOperations,
        },
        size: {
          validator: mediasAttributesConstraints.media.size,
          allowedOperations: nullableOperations,
        },
        createdAt: {
          validator: mediasAttributesConstraints.media.createdAt,
          allowedOperations: dateOperations,
        },
        updatedAt: {
          validator: mediasAttributesConstraints.media.updatedAt,
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
      } satisfies Record<keyof (MediaDTO & PrefixedOrganizationShortDTO), FilterColumnConfig>),
    }),
  },

  getByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      mediaId: mediasAttributesConstraints.media.id.required(),
    }),
  },

  updateByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      mediaId: mediasAttributesConstraints.media.id.required(),
    }),
    body: Joi.object().keys({
      name: mediasAttributesConstraints.media.name,
      notes: mediasAttributesConstraints.media.notes,
      type: mediasAttributesConstraints.media.type,
      mediaFile: Joi.object().keys({
        filename: mediasAttributesConstraints.file.filename,
        mimetype: mediasAttributesConstraints.file.mimetype,
        encoding: mediasAttributesConstraints.file.encoding,
        size: mediasAttributesConstraints.file.size,
      }),
    } satisfies Record<keyof Omit<MediaServiceUpdatableAttributes, 'buffer'>, Joi.Schema>),
  },

  deleteByIdForOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
      mediaId: mediasAttributesConstraints.media.id.required(),
    }),
  },
};

export default mediasValidationSchemas;
