import Joi from 'joi';
import usersAttributesConstraints from '../../../service/users.attributes-constraints';
import organizationAttributesConstraints from '../../../../organizations/service/organizations.attributes-constraints';
import organizationsMembersAttributesConstraints from '../../../../organizations-members/service/organizations-members.attributes-constraints';
import usersRepository from '../../../service/users.repository';
import collectionQueryParamsProcessor from '../../../../../modules/collection-query-processor';
import LANGUAGES from '../../../../../constants/languages';
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
      organizationName: organizationAttributesConstraints.organization.name.required(),
      // verificationRedirectUrl: generalAttributesConstraints.redirectUrlWithCode.required(),
    } satisfies Record<keyof Omit<SignUpFunctionParams, 'emailVerifiedAt'>, Joi.Schema>),
  },

  signUpInvitedUser: {
    body: Joi.object().keys({
      firstName: usersAttributesConstraints.user.firstName.required(),
      lastName: usersAttributesConstraints.user.lastName.required(),
      language: usersAttributesConstraints.user.language.default(LANGUAGES.EN_US),
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
        twoFactorAuthEnabled: usersAttributesConstraints.user.twoFactorAuthEnabled,
      } satisfies Record<keyof Omit<UserUpdatableAttributes, 'accountBlockedReason' | 'accountBlockedAt' | 'emailVerifiedAt' | 'password'>, Joi.Schema>)
      .with('newPassword', 'currentPassword')
      .with('currentPassword', 'newPassword')
      .or('firstName', 'lastName', 'newPassword', 'currentPassword', 'avatarUrl', 'language', 'twoFactorAuthEnabled'),
  },

  createUserOrganization: {
    body: Joi.object().keys({
      name: organizationAttributesConstraints.organization.name.required(),
    } satisfies Record<keyof OrganizationCreationAttributes, Joi.Schema>),
  },

  getAllUserOrganizationsWithPagination: {
    query: Joi.object().keys({
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

};

export default validationSchemas;
