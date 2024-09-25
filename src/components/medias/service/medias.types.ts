import { MEDIA_TYPES } from './media.constants';
import { OrganizationId, OrganizationShortDTO } from '../../organizations/service/organizations.types';


export type MediaId = string;
export type MediaName = string;
export type MediaNotes = string;
export type MediaContent = string;
export type MediaDuration = number | null;
export type MediaWidth = number | null;
export type MediaHeight = number | null;
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
  width: MediaWidth;
  height: MediaHeight;
  type: MediaType;
  mimeType: MediaMimeType;
  size: MediaSize;
  createdAt: MediaCreatedAt;
  updatedAt: MediaUpdatedAt;
}

export interface UploadedFile {
  filename: string;
  mimetype: string;
  encoding: string;
  size: number;
}

export interface MediaProperties {
  width: number | null;
  height: number | null;
  duration: number | null;
}


// export interface MediaServiceCreationAttributes extends Omit<MediaModel, 'id' | 'createdAt' | 'updatedAt' | 'organizationId' | 'duration' | 'width' | 'height' | 'size' | 'content' | 'mimeType'> {
//   file: UploadedFile;
//   buffer: Buffer;
// }

export interface MediaServiceCreationAttributes extends Pick<MediaModel, 'name' | 'notes' | 'type'> {
  mediaFile: UploadedFile;
  buffer: Buffer;
}

export type MediaServiceUpdatableAttributes = Partial<MediaServiceCreationAttributes>

export type MediaServiceRepositoryAttributes = Omit<MediaModel, 'id' | 'createdAt' | 'updatedAt'>;
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
  buffer?: Buffer;
}

/* --------------------------------- Func Params --------------------------------- */

