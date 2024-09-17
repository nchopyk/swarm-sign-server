import { UserEmail, UserId, UserShortDTO } from '../../users/service/users.types';
import { OrganizationId } from '../../organizations/service/organizations.types';


export type OrganizationMemberRole = string;
export type OrganizationMemberCreatedAt = Date;
export type OrganizationMemberUpdatedAt = Date;

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

/* --------------------- Functions Params --------------------- */
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

/* --------------------- Functions Params --------------------- */
