import { UserEmail, UserId, UserModel, UserShortDTO } from '../../users/service/users.types';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { TokenPayload } from '../../general/general.types';


export type OrganizationMemberRole = string;
export type OrganizationMemberCreatedAt = Date;
export type OrganizationMemberUpdatedAt = Date;

export type InvitationId = string;
export type InviterId = UserId;
export type InviteeEmail = UserEmail;
export type InvitationAcceptedAt = Date | null;
export type InvitationRejectedAt = Date | null;
export type InvitationCreatedAt = Date;
export type InvitationUpdatedAt = Date;


/* --------------------- Organization Members --------------------- */
export interface OrganizationMemberDTO {
  user: UserShortDTO;
  role: OrganizationMemberRole;
  createdAt: OrganizationMemberCreatedAt;
  updatedAt: OrganizationMemberUpdatedAt;
}

export interface OrganizationMemberUpdatableAttributes {
  role: OrganizationMemberRole;
}
/* --------------------- Organization User Relation Model --------------------- */


/* --------------------- Organization Invitation Model --------------------- */
export interface OrganizationInvitationModel {
  id: InvitationId;
  organizationId: OrganizationId;
  inviterId: InviterId;
  email: InviteeEmail;
  role: OrganizationMemberRole;
  acceptedAt: InvitationAcceptedAt;
  rejectedAt: InvitationRejectedAt;
  createdAt: InvitationCreatedAt;
  updatedAt: InvitationUpdatedAt;
}

export interface OrganizationInvitation {
  id: InvitationId;
  organizationId: OrganizationId;
  email: InviteeEmail;
  role: OrganizationMemberRole;
  acceptedAt: InvitationAcceptedAt;
  rejectedAt: InvitationRejectedAt;
  createdAt: InvitationCreatedAt;
  updatedAt: InvitationUpdatedAt;
  inviter: UserShortDTO;
}

export interface OrganizationInvitationCreationAttributes {
  organizationId: OrganizationId;
  inviterId: InviterId;
  email: InviteeEmail;
  role: OrganizationMemberRole;
}

/* --------------------- Organization Invitation Model --------------------- */

/* --------------------- Other --------------------- */
export interface InvitationTokenPayload extends TokenPayload {
  invitationId: InvitationId;
}

/* --------------------- Other --------------------- */

/* --------------------- Functions Params --------------------- */
export interface InviteUserToOrganizationFunctionParams {
  organizationId: OrganizationId;
  inviter: UserModel;
  email: UserEmail;
  role: OrganizationMemberRole;
  redirectUrl: string;
}

export interface GetOrganizationMemberByIdFunctionParams {
  organizationId: OrganizationId;
  userId: UserId;
}

export interface GetOrganizationMemberByEmailFunctionParams {
  organizationId: OrganizationId;
  userEmail: UserEmail;
}

export interface UpdateOrganizationUserRelationFunctionParams {
  organizationId: OrganizationId;
  userId: UserId;
  fieldsToUpdate: OrganizationMemberUpdatableAttributes;
}

export interface DeleteOrganizationUserRelationFunctionParams {
  organizationId: OrganizationId;
  userId: UserId;
}

export interface GetInviteeInvitationFunctionParams {
  organizationId: OrganizationId;
  inviteeEmail: UserEmail;
}

export interface GetOrganizationInvitationByIdFunctionParams {
  organizationId: OrganizationId;
  invitationId: InvitationId;
}

/* --------------------- Functions Params --------------------- */
