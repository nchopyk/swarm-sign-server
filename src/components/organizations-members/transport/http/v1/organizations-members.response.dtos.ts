import organizationsResponseAttributes from './organizations-members.response.attributes';
import { CollectionResource, DTOResource } from '../../../../general/general.types';
import { OrganizationMemberDTO } from '../../../service/organizations-members.types';
import { paginationDTO } from '../../../../general/general.response.dto';
import { UserModel } from '../../../../users/service/users.types';
import userDTOs from '../../../../users/transport/http/v1/users.response.dtos';


/* ------------------------- Organization Members DTOs ------------------------- */
const memberDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'organization.member' },
    user: userDTOs.shortDTO,
    role: organizationsResponseAttributes.member.role,
    createdAt: organizationsResponseAttributes.member.createdAt,
    updatedAt: organizationsResponseAttributes.member.updatedAt,
  } satisfies DTOResource<OrganizationMemberDTO>,
};

const membersList = {
  type: 'array',
  items: memberDTO,
};

const membersCollectionDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'collection' },
    dataType: { type: 'string', default: 'organization.member' },
    data: membersList,
    meta: paginationDTO,
  } satisfies DTOResource<CollectionResource<UserModel>>,
};
/* ------------------------- Organization Members DTOs ------------------------- */

/* ------------------------- Members Management DTOs ------------------------- */
const excludeMemberResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'organization.member.excluded' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const inviteMemberResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'organization.member.invited' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};
/* ------------------------- Members Management DTOs ------------------------- */

/* ------------------------- Organization Invitations DTOs ------------------------- */
const deleteInvitationResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'organization.invitation.deleted' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};
/* ------------------------- Organization Invitations DTOs ------------------------- */

export default {
  memberDTO,
  membersCollectionDTO,
  excludeMemberResponseDTO,
  inviteMemberResponseDTO,
  deleteInvitationResponseDTO,
};
