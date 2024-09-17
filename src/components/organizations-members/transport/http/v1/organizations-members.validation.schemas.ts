import Joi from 'joi';
import organizationsAttributesConstraints from '../../../../organizations/service/organizations.attributes-constraints';
import organizationsMembersAttributesConstraints from '../../../service/organizations-members.attributes-constraints';
import usersAttributesConstraints from '../../../../users/service/users.attributes-constraints';
import generalAttributesConstraints from '../../../../general/general.attributes-constraints';
import collectionQueryParamsProcessor from '../../../../../modules/collection-query-processor';
import organizationsMembersRepository from '../../../service/organizations-members.repository';
import { dateOperations, stringOperations } from '../../../../../modules/collection-query-processor/filter/filter.operations';
import { InviteUserToOrganizationFunctionParams } from '../../../service/organizations-members.types';
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

  inviteUserToOrganization: {
    params: Joi.object().keys({
      organizationId: organizationsAttributesConstraints.organization.id.required(),
    }),

    body: Joi.object().keys({
      email: usersAttributesConstraints.user.email.required(),
      role: organizationsMembersAttributesConstraints.member.role.required(),
      redirectUrl: generalAttributesConstraints.redirectUrlWithCode.required(),
    } satisfies Record<keyof Omit<InviteUserToOrganizationFunctionParams, 'organizationId' | 'inviter'>, Joi.Schema>),
  },

  getOrganizationInvitations: {
    params: Joi.object().keys({
      organizationId: organizationsAttributesConstraints.organization.id.required(),
    }),
    query: Joi.object().keys({
      page: collectionQueryParamsProcessor.pagination.handleQueryParams({
        defaultValue: { number: 1, size: 20 },
      }),

      sort: collectionQueryParamsProcessor.sort.handleQueryParams({
        defaultValue: { createdAt: { order: 'desc' } },
        columns: Object.keys(organizationsMembersRepository.invitationColumns),
      }),

      where: collectionQueryParamsProcessor.filter.handleQueryParams({
        id: {
          validator: organizationsMembersAttributesConstraints.invitation.id,
          allowedOperations: stringOperations,
        },

        email: {
          validator: organizationsMembersAttributesConstraints.invitation.email,
          allowedOperations: stringOperations,
        },

        role: {
          validator: organizationsMembersAttributesConstraints.invitation.role,
          allowedOperations: stringOperations,
        },

        acceptedAt: {
          validator: organizationsMembersAttributesConstraints.invitation.acceptedAt.allow(''),
          allowedOperations: dateOperations,
        },

        rejectedAt: {
          validator: organizationsMembersAttributesConstraints.invitation.rejectedAt.allow(''),
          allowedOperations: dateOperations,
        },

        createdAt: {
          validator: organizationsMembersAttributesConstraints.invitation.createdAt,
          allowedOperations: dateOperations,
        },

        updatedAt: {
          validator: organizationsMembersAttributesConstraints.invitation.updatedAt,
          allowedOperations: dateOperations,
        },

        'inviter.id': {
          validator: usersAttributesConstraints.user.id,
          allowedOperations: stringOperations,
        },

        'inviter.email': {
          validator: usersAttributesConstraints.user.email,
          allowedOperations: stringOperations,
        },

        'inviter.firstName': {
          validator: usersAttributesConstraints.user.firstName,
          allowedOperations: stringOperations,
        },

        'inviter.lastName': {
          validator: usersAttributesConstraints.user.lastName,
          allowedOperations: stringOperations,
        },
      }),
    }),
  },

  cancelOrganizationInvitation: {
    params: Joi.object().keys({
      organizationId: organizationsAttributesConstraints.organization.id.required(),
      invitationId: organizationsMembersAttributesConstraints.invitation.id.required(),
    }),
  },
};

export default validationSchemas;
