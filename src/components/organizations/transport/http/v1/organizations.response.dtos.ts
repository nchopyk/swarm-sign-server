import organizationsResponseAttributes from './organizations.response.attributes';
import { DTOResource } from '../../../../general/general.types';
import { OrganizationModel, OrganizationShortDTO } from '../../../service/organizations.types';

/* ------------------------- Organization DTOs ------------------------- */
const detailedDTO = {
  type: 'object',
  nullable: true,
  properties: {
    resourceType: { type: 'string', default: 'organization.detail' },
    id: organizationsResponseAttributes.organization.id,
    name: organizationsResponseAttributes.organization.name,
    createdAt: organizationsResponseAttributes.organization.createdAt,
    updatedAt: organizationsResponseAttributes.organization.updatedAt,
  } satisfies DTOResource<OrganizationModel>,
};

const shortDTO = {
  type: 'object',
  nullable: true,
  properties: {
    resourceType: { type: 'string', default: 'organization.short' },
    id: organizationsResponseAttributes.organization.id,
    name: organizationsResponseAttributes.organization.name,
    createdAt: organizationsResponseAttributes.organization.createdAt,
    updatedAt: organizationsResponseAttributes.organization.updatedAt,
  } satisfies DTOResource<OrganizationShortDTO>,
};

const deletedDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'organization.deleted' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

/* ------------------------- Organization DTOs ------------------------- */

export default {
  detailedDTO,
  shortDTO,
  deletedDTO,
};
