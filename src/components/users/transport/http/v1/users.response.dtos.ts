import usersResponseAttributes from './users.response.attributes';
import organizationsResponseDtos from '../../../../organizations/transport/http/v1/organizations.response.dtos';
import organizationsMembersResponseAttributes from '../../../../organizations-members/transport/http/v1/organizations-members.response.attributes';
import { paginationDTO } from '../../../../general/general.response.dto';
import { CollectionResource, DTOResource } from '../../../../general/general.types';
import {
  LoginFunctionReturn,
  UserOrganizationInvitation,
  UserOrganization,
  UserTokens,
  UserShortDTO,
  UserExtendedOrganizationInvitation,
  UserDTO,
} from '../../../service/users.types';

const detailedDTO = {
  type: 'object',
  nullable: true,
  properties: {
    resourceType: { type: 'string', default: 'user.detailed' },
    id: usersResponseAttributes.user.id,
    email: usersResponseAttributes.user.email,
    firstName: usersResponseAttributes.user.firstName,
    lastName: usersResponseAttributes.user.lastName,
    avatarUrl: usersResponseAttributes.user.avatarUrl,
    language: usersResponseAttributes.user.language,
    temperatureUnit: usersResponseAttributes.user.temperatureUnit,
    distanceUnit: usersResponseAttributes.user.distanceUnit,
    volumeUnit: usersResponseAttributes.user.volumeUnit,
    accountBlockedAt: usersResponseAttributes.user.accountBlockedAt,
    accountBlockedReason: usersResponseAttributes.user.accountBlockedReason,
    emailVerifiedAt: usersResponseAttributes.user.emailVerifiedAt,
    twoFactorAuthEnabled: usersResponseAttributes.user.twoFactorAuthEnabled,
    createdAt: usersResponseAttributes.user.createdAt,
    updatedAt: usersResponseAttributes.user.updatedAt,
  } satisfies DTOResource<UserDTO>,
};

const shortDTO = {
  type: 'object',
  nullable: true,
  properties: {
    resourceType: { type: 'string', default: 'user.short' },
    id: usersResponseAttributes.user.id,
    email: usersResponseAttributes.user.email,
    firstName: usersResponseAttributes.user.firstName,
    lastName: usersResponseAttributes.user.lastName,
    avatarUrl: usersResponseAttributes.user.avatarUrl,
  } satisfies DTOResource<UserShortDTO>,
};

const verificationEmailSentResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'user.verificationEmailSent' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const accountCreatedResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'user.accountCreated' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const tokensDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'user.tokens' },
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
  } satisfies DTOResource<UserTokens>,
};

const loginSuccessfulResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'user.loginSuccessful' },
    user: detailedDTO,
    tokens: tokensDTO,
  } satisfies DTOResource<LoginFunctionReturn>,
};

const recoverPasswordResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'user.resetPasswordEmailSent' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const resetPasswordResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'user.resetPasswordSuccessful' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const deleteAccountWithOrganizationsSuccessfulResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'user.accountWithOrganizationsDeleteSuccessful' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const leaveOrganizationResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'user.leaveOrganizationSuccessful' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const userInvitationToOrganizationDTO = {
  type: 'object',
  nullable: true,
  properties: {
    resourceType: { type: 'string', default: 'user.organization.invitation' },
    id: organizationsMembersResponseAttributes.invitation.id,
    email: usersResponseAttributes.user.email,
    role: usersResponseAttributes.organizationRelation.role,
    acceptedAt: organizationsMembersResponseAttributes.invitation.acceptedAt,
    rejectedAt: organizationsMembersResponseAttributes.invitation.rejectedAt,
    createdAt: organizationsMembersResponseAttributes.invitation.createdAt,
    updatedAt: organizationsMembersResponseAttributes.invitation.updatedAt,
    organization: organizationsResponseDtos.shortDTO,
    inviter: shortDTO,
  } satisfies DTOResource<UserOrganizationInvitation>,
};

const userExtendedInvitationToOrganizationDTO = {
  type: 'object',
  nullable: true,
  properties: {
    resourceType: { type: 'string', default: 'user.organization.invitation.extended' },
    id: organizationsMembersResponseAttributes.invitation.id,
    email: usersResponseAttributes.user.email,
    role: usersResponseAttributes.organizationRelation.role,
    acceptedAt: organizationsMembersResponseAttributes.invitation.acceptedAt,
    rejectedAt: organizationsMembersResponseAttributes.invitation.rejectedAt,
    createdAt: organizationsMembersResponseAttributes.invitation.createdAt,
    updatedAt: organizationsMembersResponseAttributes.invitation.updatedAt,
    organization: organizationsResponseDtos.shortDTO,
    inviter: shortDTO,
    invitee: shortDTO,
  } satisfies DTOResource<UserExtendedOrganizationInvitation>,
};

const userInvitationsToOrganizationsListDTO = {
  type: 'array',
  items: userInvitationToOrganizationDTO,
};

const userInvitationsToOrganizationsCollectionDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'collection' },
    dataType: { type: 'string', default: 'user.organization.invitation' },
    data: userInvitationsToOrganizationsListDTO,
    meta: paginationDTO,
  } satisfies DTOResource<CollectionResource<UserDTO>>,
};

const acceptInvitationToOrganizationResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'user.organization.invitation.accepted' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const rejectInvitationToOrganizationResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'user.organization.invitation.rejected' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const userOrganizationDTO = {
  type: 'object',
  nullable: true,
  properties: {
    resourceType: { type: 'string', default: 'user.organization' },
    role: usersResponseAttributes.organizationRelation.role,
    createdAt: usersResponseAttributes.organizationRelation.createdAt,
    updatedAt: usersResponseAttributes.organizationRelation.updatedAt,
    organization: organizationsResponseDtos.shortDTO,
  } satisfies DTOResource<Omit<UserOrganization, 'userId' | 'organizationId'>>,
};

const userOrganizationsList = {
  type: 'array',
  items: userOrganizationDTO,
};

const userOrganizationsCollectionDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'collection' },
    dataType: { type: 'string', default: 'user.organization' },
    data: userOrganizationsList,
    meta: paginationDTO,
  } satisfies DTOResource<CollectionResource<UserDTO>>,
};

export default {
  detailedDTO,
  shortDTO,
  verificationEmailSentResponseDTO,
  accountCreatedResponseDTO,
  tokensDTO,
  loginSuccessfulResponseDTO,
  recoverPasswordResponseDTO,
  resetPasswordResponseDTO,
  deleteAccountWithOrganizationsSuccessfulResponseDTO,
  leaveOrganizationResponseDTO,
  userInvitationToOrganizationDTO,
  userExtendedInvitationToOrganizationDTO,
  userInvitationsToOrganizationsCollectionDTO,
  acceptInvitationToOrganizationResponseDTO,
  rejectInvitationToOrganizationResponseDTO,
  userOrganizationDTO,
  userOrganizationsCollectionDTO,
};
