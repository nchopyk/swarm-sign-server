import { TemperatureUnitType, DistanceUnitType, VolumeUnitType } from '../../../constants/units';
import { LanguageType } from '../../../constants/languages';
import { OrganizationRoleType } from '../../../constants/organization-roles';
import { TokenTypeValue } from '../../../constants/token-types';
import {
  OrganizationCreationAttributes,
  OrganizationId,
  OrganizationModel,
  OrganizationName,
} from '../../organizations/service/organizations.types';
import { InvitationId, InvitationAcceptedAt, InvitationRejectedAt } from '../../organizations-members/service/organizations-members.types';
import { TokenPayload } from '../../general/general.types';

export type UserId = string;
export type UserEmail = string;
export type UserFirstName = string;
export type UserLastName = string;
export type UserPassword = string;
export type UserAvatarUrl = string | null;
export type UserLanguage = LanguageType;
export type UserTemperatureUnit = TemperatureUnitType;
export type UserDistanceUnit = DistanceUnitType;
export type UserVolumeUnit = VolumeUnitType;
export type UserAccountBlockedAt = Date | null;
export type UserAccountBlockedReason = string | null;
export type UserEmailVerifiedAt = Date | null;
export type UserTwoFactorAuthEnabled = boolean;
export type UserCreatedAt = Date;
export type UserUpdatedAt = Date;
export type UserActivityLogId = string;
export type UserActivityLogSection = string;
export type UserActivityLogAction = string;
export type UserActivityLogStatus = string;
export type UserActivityLogIp = string | null;
export type UserActivityLogUserAgent = string | null;
export type UserActivityLogMeta = object | null;


/* --------------------- User Model --------------------- */
export type UserModel = {
  id: UserId;
  email: UserEmail;
  firstName: UserFirstName;
  lastName: UserLastName;
  password: UserPassword;
  avatarUrl: UserAvatarUrl;
  language: UserLanguage;
  temperatureUnit: UserTemperatureUnit;
  distanceUnit: UserDistanceUnit;
  volumeUnit: UserVolumeUnit;
  accountBlockedAt: UserAccountBlockedAt;
  accountBlockedReason: UserAccountBlockedReason;
  emailVerifiedAt: UserEmailVerifiedAt;
  twoFactorAuthEnabled: UserTwoFactorAuthEnabled;
  createdAt: UserCreatedAt;
  updatedAt: UserUpdatedAt;
}

export interface UserCreationAttributes {
  email: UserEmail;
  password: UserPassword;
  firstName: UserFirstName;
  lastName: UserLastName;
  language: UserLanguage;
  temperatureUnit: UserTemperatureUnit;
  distanceUnit: UserDistanceUnit;
  volumeUnit: UserVolumeUnit;
  emailVerifiedAt?: UserEmailVerifiedAt;
}

export interface UserUpdatableAttributes extends Partial<Omit<UserModel, 'id' | 'email' | 'createdAt' | 'updatedAt'>> {
  currentPassword?: UserPassword;
  newPassword?: UserPassword;
}

/* --------------------- User Model --------------------- */

/* --------------------- User DTOs --------------------- */
export interface UserDTO extends Omit<UserModel, 'password'> {
}

export type PrefixedUserDTO = {
  [K in keyof UserDTO as `user.${K}`]: UserDTO[K]
};
/* --------------------- User DTOs --------------------- */


/* --------------------- User Organization Relation Model --------------------- */
export interface UserOrganizationRelationModel {
  userId: UserId;
  organizationId: OrganizationId;
  role: OrganizationRoleType;
  createdAt: Date;
  updatedAt: Date;
}

export type UserOrganizationRelationCreationAttributes = Omit<UserOrganizationRelationModel, 'createdAt' | 'updatedAt'>
/* --------------------- User Organization Relation Model --------------------- */

/* --------------------- User Organization Relation DTOs --------------------- */
export interface UserOrganizationRelationDTO extends Omit<UserOrganizationRelationModel, 'userId' | 'organizationId'> {
}

/* --------------------- User Organization Relation DTOs --------------------- */

/* --------------------- User Activity Log Model --------------------- */
export type UserActivityLogModel = {
  id: UserActivityLogId;
  userId: UserId;
  section: UserActivityLogSection;
  action: UserActivityLogAction;
  status: UserActivityLogStatus;
  ipAddress: UserActivityLogIp;
  userAgent: UserActivityLogUserAgent
  meta: UserActivityLogMeta;
  createdAt: Date;
  updatedAt: Date;
}

export type UserActivityLogCreationAttributes = {
  userId: UserId;
  section: UserActivityLogSection;
  action: UserActivityLogAction;
  status: UserActivityLogStatus;
  ipAddress?: UserActivityLogIp;
  userAgent?: UserActivityLogUserAgent
  meta?: UserActivityLogMeta;
}
/* --------------------- User Activity Log Model --------------------- */


/* --------------------- User Tokens Model --------------------- */
export interface JWTAuthTokenPayload extends TokenPayload {
  userId: UserId;
  email: UserEmail;
}

export interface JWTRecoveryTokenPayload extends TokenPayload {
  email: UserEmail;
  checksum: string;
}

export interface JWTEmailVerificationTokenPayload extends TokenPayload {
  email: UserEmail;
  tokenType: TokenTypeValue;
}

export type UserTokens = {
  accessToken: string;
  refreshToken: string;
}
/* --------------------- User Tokens Model --------------------- */


/* --------------------- User Organization Invitation Model --------------------- */
export interface UserOrganizationInvitationModel {
  id: InvitationId,
  email: UserEmail,
  role: OrganizationRoleType,
  organizationId: OrganizationId,
  acceptedAt: InvitationAcceptedAt,
  rejectedAt: InvitationRejectedAt,
  createdAt: Date,
  updatedAt: Date,
}

export interface UserOrganizationInvitation extends Omit<UserOrganizationInvitationModel, 'organizationId'> {
  organization: OrganizationModel;
  inviter: UserModel;
}

export interface UserExtendedOrganizationInvitation extends UserOrganizationInvitation {
  invitee: UserModel | null;
}

export type  UserOrganizationInvitationUpdatableAttributes = Partial<Pick<UserOrganizationInvitationModel, 'acceptedAt' | 'rejectedAt'>>
/* --------------------- User Organization Invitation Model --------------------- */


/* --------------------- User Organization Model --------------------- */
export interface UserOrganization extends UserOrganizationRelationModel {
  organization: OrganizationModel;
}

/* --------------------- User Organization Model --------------------- */


/* --------------------- DTOs --------------------- */
export type UserShortDTO = Pick<UserModel, 'id' | 'email' | 'firstName' | 'lastName' | 'avatarUrl'>

export type PrefixedUserShortDTO = {
  [K in keyof UserShortDTO as `user.${K}`]: UserShortDTO[K]
};
/* --------------------- DTOs --------------------- */


/* --------------------- Other --------------------- */
export interface RecoveryPasswordChecksumPayload {
  email: UserEmail;
  updatedAt: UserUpdatedAt;
  lastSuccessfulLogId: UserActivityLogId | null;
}

/* --------------------- Other --------------------- */


/* --------------------- Function Types --------------------- */
export interface SignUpFunctionParams extends UserCreationAttributes {
  organizationName: OrganizationName;
  // verificationRedirectUrl: string;
}

export interface SignUpInvitedUserFunctionParams extends Omit<UserCreationAttributes, 'email'> {
  code: string;
}

export interface LoginFunctionParams {
  email: UserEmail;
  password: UserPassword;
  ipAddress: UserActivityLogIp;
  userAgent: UserActivityLogUserAgent;
}

export interface LoginFunctionReturn {
  user: UserModel;
  tokens: UserTokens;
}

export interface RecoverPasswordFunctionParams {
  email: UserEmail;
  redirectUrl: string;
  ipAddress: UserActivityLogIp;
  userAgent: UserActivityLogUserAgent;
}

export interface ResetPasswordFunctionParams {
  newPassword: UserPassword;
  token: string;
  ipAddress: UserActivityLogIp;
  userAgent: UserActivityLogUserAgent;
}

export interface ResendVerificationEmailFunctionParams {
  email: UserEmail;
  verificationRedirectUrl: string;
}

export interface CreateOrganizationFunctionParams extends OrganizationCreationAttributes {
  userId: UserId;
}

/* --------------------- Function Types --------------------- */

