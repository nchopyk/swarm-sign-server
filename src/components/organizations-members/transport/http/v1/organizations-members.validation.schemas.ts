import Joi from 'joi';
import organizationsAttributesConstraints from '../../../../organizations/service/organizations.attributes-constraints';
import organizationsMembersAttributesConstraints from '../../../service/organizations-members.attributes-constraints';
import usersAttributesConstraints from '../../../../users/service/users.attributes-constraints';
import collectionQueryParamsProcessor from '../../../../../modules/collection-query-processor';
import organizationsMembersRepository from '../../../service/organizations-members.repository';
import { dateOperations, stringOperations } from '../../../../../modules/collection-query-processor/filter/filter.operations';
import { PrefixedUserShortDTO, UserOrganizationRelationDTO } from '../../../../users/service/users.types';
import { FilterColumnConfig } from '../../../../../modules/collection-query-processor/filter/types';

const validationSchemas = {
  getAllOrganizationMembers: {
    params: Joi.object().keys({
      organizationId: organizationsAttributesConstraints.organization.id.required(),
    }),
    query: Joi.object().keys({
      page: collectionQueryParamsProcessor.pagination.handleQueryParams({
        defaultValue: { number: 1, size: 20 },
      }),

      sort: collectionQueryParamsProcessor.sort.handleQueryParams({
        columns: Object.keys(organizationsMembersRepository.memberColumns),
        defaultValue: { createdAt: { order: 'desc' } },
      }),

      where: collectionQueryParamsProcessor.filter.handleQueryParams({
        'user.id': {
          validator: usersAttributesConstraints.user.id,
          allowedOperations: stringOperations,
        },

        'user.email': {
          validator: usersAttributesConstraints.user.email,
          allowedOperations: stringOperations,
        },

        'user.firstName': {
          validator: usersAttributesConstraints.user.firstName,
          allowedOperations: stringOperations,
        },

        'user.lastName': {
          validator: usersAttributesConstraints.user.lastName,
          allowedOperations: stringOperations,
        },

        'user.avatarUrl': {
          validator: usersAttributesConstraints.user.avatarUrl,
          allowedOperations: stringOperations,
        },

        role: {
          validator: organizationsMembersAttributesConstraints.member.role,
          allowedOperations: stringOperations,
        },

        createdAt: {
          validator: organizationsMembersAttributesConstraints.member.createdAt,
          allowedOperations: dateOperations,
        },

        updatedAt: {
          validator: organizationsMembersAttributesConstraints.member.updatedAt,
          allowedOperations: dateOperations,
        },
      } satisfies Record<keyof (PrefixedUserShortDTO & UserOrganizationRelationDTO), FilterColumnConfig>),
    }),
  },

  updateOrganizationMemberById: {
    params: Joi.object().keys({
      organizationId: organizationsAttributesConstraints.organization.id.required(),
      userId: usersAttributesConstraints.user.id.required(),
    }),

    body: Joi.object().keys({
      role: organizationsMembersAttributesConstraints.member.role.required(),
    }),
  },

  excludeMemberFromOrganization: {
    params: Joi.object().keys({
      organizationId: organizationsAttributesConstraints.organization.id.required(),
      userId: usersAttributesConstraints.user.id.required(),
    }),
  },
};

export default validationSchemas;
