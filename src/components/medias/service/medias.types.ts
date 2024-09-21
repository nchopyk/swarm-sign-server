import { MEDIA_TYPES } from './media.constants';
import { OrganizationId, OrganizationShortDTO } from '../../organizations/service/organizations.types';


export type MediaId = string;
export type MediaName = string;
export type MediaNotes = string;
export type MediaContent = string;
export type MediaDuration = string;
export type MediaType = typeof MEDIA_TYPES[keyof typeof MEDIA_TYPES];
export type MediaMimeType = string;
export type MediaSize = number
export type MediaCreatedAt = Date;
export type MediaUpdatedAt = Date;


/* --------------------------------- Media Model --------------------------------- */
export interface MediaModel {
  id: MediaId;
  organizationId: OrganizationId;
  name: MediaName;
  notes: MediaNotes;
  content: MediaContent;
  duration: MediaDuration;
  type: MediaType;
  mimeType: MediaMimeType;
  size: MediaSize;
  createdAt: MediaCreatedAt;
  updatedAt: MediaUpdatedAt;
}


export type MediaCreationAttributes = Omit<MediaModel, 'id' | 'createdAt' | 'updatedAt'>;
export type MediaServiceUpdatableAttributes = Partial<Omit<MediaModel, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>>;
export type MediaRepositoryUpdatableAttributes = Partial<Omit<MediaModel, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>>;
/* --------------------------------- Media Model --------------------------------- */


/* --------------------------------- Media DTOs --------------------------------- */
export interface MediaDTO extends Omit<MediaModel, 'organizationId'> {
  organization: OrganizationShortDTO;
}

/* --------------------------------- Media DTOs --------------------------------- */


/* --------------------------------- Func Params --------------------------------- */
export interface GetMediaByIdFuncParams {
  mediaId: MediaId;
  organizationId: OrganizationId;
}

export interface GetModelByIdForOrganizationFuncParams {
  mediaId: MediaId;
  organizationId: OrganizationId;
}

export interface GetDTOByIdForOrganizationFuncParams {
  mediaId: MediaId;
  organizationId: OrganizationId;
}

export interface UpdateByIdForOrganizationFuncParams {
  mediaId: MediaId;
  organizationId: OrganizationId;
  fieldsToUpdate: MediaServiceUpdatableAttributes;
}

/* --------------------------------- Func Params --------------------------------- */

