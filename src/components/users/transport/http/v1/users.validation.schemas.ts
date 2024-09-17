import Joi from 'joi';
import usersAttributesConstraints from '../../../service/users.attributes-constraints';
import organizationAttributesConstraints from '../../../../organizations/service/organizations.attributes-constraints';
import organizationsMembersAttributesConstraints from '../../../../organizations-members/service/organizations-members.attributes-constraints';
import usersRepository from '../../../service/users.repository';
import collectionQueryParamsProcessor from '../../../../../modules/collection-query-processor';
import LANGUAGES from '../../../../../constants/languages';
import { DISTANCE, TEMPERATURE, VOLUME } from '../../../../../constants/units';
import generalAttributesConstraints from '../../../../general/general.attributes-constraints';
import organizationsRepository from '../../../../organizations/service/organizations.repository';
import { dateOperations, stringOperations } from '../../../../../modules/collection-query-processor/filter/filter.operations';
import { OrganizationCreationAttributes, PrefixedOrganizationDTO } from '../../../../organizations/service/organizations.types';
import { FilterColumnConfig } from '../../../../../modules/collection-query-processor/filter/types';
import {
  SignUpFunctionParams,
  SignUpInvitedUserFunctionParams,
  UserOrganizationRelationDTO,
  UserUpdatableAttributes,
} from '../../../service/users.types';

const validationSchemas = {
  signUp: {
    body: Joi.object().keys({
      email: usersAttributesConstraints.user.email.required(),
      password: usersAttributesConstraints.user.password.required(),
      firstName: usersAttributesConstraints.user.firstName.required(),
      lastName: usersAttributesConstraints.user.lastName.required(),
      language: usersAttributesConstraints.user.language.default(LANGUAGES.EN_US),
      temperatureUnit: usersAttributesConstraints.user.temperatureUnit.default(TEMPERATURE.CELSIUS),
      distanceUnit: usersAttributesConstraints.user.distanceUnit.default(DISTANCE.KILOMETER),
      volumeUnit: usersAttributesConstraints.user.volumeUnit.default(VOLUME.LITER),
      organizationName: organizationAttributesConstraints.organization.name.required(),
      // verificationRedirectUrl: generalAttributesConstraints.redirectUrlWithCode.required(),
    } satisfies Record<keyof Omit<SignUpFunctionParams, 'emailVerifiedAt'>, Joi.Schema>),
  },

  signUpInvitedUser: {
    body: Joi.object().keys({
      firstName: usersAttributesConstraints.user.firstName.required(),
      lastName: usersAttributesConstraints.user.lastName.required(),
      language: usersAttributesConstraints.user.language.default(LANGUAGES.EN_US),
      temperatureUnit: usersAttributesConstraints.user.temperatureUnit.default(TEMPERATURE.CELSIUS),
      distanceUnit: usersAttributesConstraints.user.distanceUnit.default(DISTANCE.KILOMETER),
      volumeUnit: usersAttributesConstraints.user.volumeUnit.default(VOLUME.LITER),
      password: usersAttributesConstraints.user.password.required(),
      code: generalAttributesConstraints.JWTToken.required(),
    } satisfies Record<keyof Omit<SignUpInvitedUserFunctionParams, 'emailVerifiedAt'>, Joi.Schema>),
  },

  verifyEmail: {
    body: Joi.object().keys({
      code: generalAttributesConstraints.JWTToken.required(),
    }),
  },

  resendVerificationEmail: {
    body: Joi.object().keys({
      email: usersAttributesConstraints.user.email.required(),
      verificationRedirectUrl: generalAttributesConstraints.redirectUrlWithCode.required(),
    }),
  },

  login: {
    body: Joi.object().keys({
      email: usersAttributesConstraints.user.email.required(),
      password: usersAttributesConstraints.user.password.required(),
    }),
  },

  recoverPassword: {
    body: Joi.object().keys({
      email: usersAttributesConstraints.user.email.required(),
      redirectUrl: generalAttributesConstraints.redirectUrlWithCode.required(),
    }),
  },

  resetPassword: {
    body: Joi.object().keys({
      newPassword: usersAttributesConstraints.user.password.required(),
      code: generalAttributesConstraints.JWTToken.required(),
    }),
  },

  refreshToken: {
    body: Joi.object().keys({
      refreshToken: generalAttributesConstraints.JWTToken.required(),
    }),
  },

  updateCurrentUser: {
    body: Joi.object()
      .keys({
        firstName: usersAttributesConstraints.user.firstName,
        lastName: usersAttributesConstraints.user.lastName,
        newPassword: usersAttributesConstraints.user.password,
        currentPassword: usersAttributesConstraints.user.password,
        avatarUrl: usersAttributesConstraints.user.avatarUrl,
        language: usersAttributesConstraints.user.language,
        temperatureUnit: usersAttributesConstraints.user.temperatureUnit,
        distanceUnit: usersAttributesConstraints.user.distanceUnit,
        volumeUnit: usersAttributesConstraints.user.volumeUnit,
        twoFactorAuthEnabled: usersAttributesConstraints.user.twoFactorAuthEnabled,
      } satisfies Record<keyof Omit<UserUpdatableAttributes, 'accountBlockedReason' | 'accountBlockedAt' | 'emailVerifiedAt' | 'password'>, Joi.Schema>)
      .with('newPassword', 'currentPassword')
      .with('currentPassword', 'newPassword')
      .or('firstName', 'lastName', 'newPassword', 'currentPassword', 'avatarUrl', 'language', 'temperatureUnit', 'distanceUnit', 'volumeUnit', 'twoFactorAuthEnabled'),
  },

  createUserOrganization: {
    body: Joi.object().keys({
      name: organizationAttributesConstraints.organization.name.required(),
    } satisfies Record<keyof OrganizationCreationAttributes, Joi.Schema>),
  },

  getAllUserOrganizationsWithPagination: {
    query: Joi.object().keys({
      page: collectionQueryParamsProcessor.pagination.handleQueryParams({
        defaultValue: { number: 1, size: 20 },
      }),

      sort: collectionQueryParamsProcessor.sort.handleQueryParams({
        columns: [
          ...Object.keys(organizationsRepository.organizationsModelToPrefixedColumnsMapWithAliases),
          ...Object.keys(usersRepository.usersOrganizationRelationModelToPrefixedColumnsMap),
        ],
        defaultValue: { createdAt: { order: 'desc' } },
      }),

      where: collectionQueryParamsProcessor.filter.handleQueryParams({
        role: {
          validator: organizationsMembersAttributesConstraints.member.role,
          allowedOperations: stringOperations,
        },
        createdAt: {
          validator: usersAttributesConstraints.user.createdAt,
          allowedOperations: dateOperations,
        },
        updatedAt: {
          validator: usersAttributesConstraints.user.updatedAt,
          allowedOperations: dateOperations,
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
      } satisfies Record<keyof (PrefixedOrganizationDTO & UserOrganizationRelationDTO), FilterColumnConfig>),
    }),
  },

  getUserOrganizationById: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
  },

  leaveOrganization: {
    params: Joi.object().keys({
      organizationId: organizationAttributesConstraints.organization.id.required(),
    }),
  },

  getAllInvitationsToOrganizationsWithPagination: {
    query: Joi.object().keys({
      page: collectionQueryParamsProcessor.pagination.handleQueryParams({
        defaultValue: { number: 1, size: 20 },
      }),

      sort: collectionQueryParamsProcessor.sort.handleQueryParams({
        defaultValue: { createdAt: { order: 'desc' } },
        columns: Object.keys(usersRepository.userOrganizationsColumns),
      }),

      where: collectionQueryParamsProcessor.filter.handleQueryParams({ //TODO: Add type
        id: {
          validator: organizationsMembersAttributesConstraints.invitation.id,
          allowedOperations: stringOperations,
        },
        role: {
          validator: organizationsMembersAttributesConstraints.member.role,
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
          validator: usersAttributesConstraints.user.createdAt,
          allowedOperations: dateOperations,
        },
        updatedAt: {
          validator: usersAttributesConstraints.user.updatedAt,
          allowedOperations: dateOperations,
        },
        'organization.id': {
          validator: organizationAttributesConstraints.organization.id,
          allowedOperations: stringOperations,
        },
        'organization.name': {
          validator: organizationAttributesConstraints.organization.name,
          allowedOperations: stringOperations,
        },
        'inviters.id': {
          validator: usersAttributesConstraints.user.id,
          allowedOperations: stringOperations,
        },
        'inviters.email': {
          validator: usersAttributesConstraints.user.email,
          allowedOperations: stringOperations,
        },
        'inviters.firstName': {
          validator: usersAttributesConstraints.user.firstName,
          allowedOperations: stringOperations,
        },
        'inviters.lastName': {
          validator: usersAttributesConstraints.user.lastName,
          allowedOperations: stringOperations,
        },
      }),
    }),
  },

  acceptInvitationToOrganization: {
    params: Joi.object().keys({
      invitationId: organizationsMembersAttributesConstraints.invitation.id.required(),
    }),
  },

  rejectInvitationToOrganization: {
    params: Joi.object().keys({
      invitationId: organizationsMembersAttributesConstraints.invitation.id.required(),
    }),
  },
};

export default validationSchemas;
