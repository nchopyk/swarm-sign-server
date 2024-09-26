import { OrganizationId, OrganizationShortDTO } from '../../organizations/service/organizations.types';
import { MediaId } from '../../medias/service/medias.types';


export type PlaylistId = string;
export type PlaylistName = string;
export type PlaylistNotes = string | null;
export type PlaylistCreatedAt = Date;
export type PlaylistUpdatedAt = Date;

export type PlaylistMediaId = string;
export type PlaylistMediaDuration = number;
export type PlaylistMediaCreatedAt = Date;
export type PlaylistMediaUpdatedAt = Date;


/* --------------------------------- Playlist Model --------------------------------- */
export interface PlaylistModel {
  id: PlaylistId;
  organizationId: OrganizationId;
  name: PlaylistName;
  notes: PlaylistNotes;
  createdAt: PlaylistCreatedAt;
  updatedAt: PlaylistUpdatedAt;
}


export type PlaylistServiceCreationAttributes = Omit<PlaylistModel, 'id' | 'createdAt' | 'updatedAt'>;
export type PlaylistRepositoryCreationAttributes = Omit<PlaylistModel, 'id' | 'createdAt' | 'updatedAt'>;

export type PlaylistServiceUpdatableAttributes = Partial<Omit<PlaylistModel, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>>;
export type PlaylistRepositoryUpdatableAttributes = Partial<Omit<PlaylistModel, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>>;
/* --------------------------------- Playlist Model --------------------------------- */


/* --------------------------------- Playlist Media Model --------------------------------- */
export interface PlaylistMediaModel {
  id: PlaylistMediaId;
  playlistId: PlaylistId;
  mediaId: MediaId;
  duration: PlaylistMediaDuration;
  createdAt: PlaylistMediaCreatedAt;
  updatedAt: PlaylistMediaUpdatedAt;
}

export type PlaylistMediaRepositoryCreationAttributes = Omit<PlaylistMediaModel, 'id' | 'createdAt' | 'updatedAt'>;
/* --------------------------------- Playlist Media Model --------------------------------- */


/* --------------------------------- Playlist DTOs --------------------------------- */
export interface PlaylistDTO extends Omit<PlaylistModel, 'organizationId'> {
  organization: OrganizationShortDTO;
}

/* --------------------------------- Playlist DTOs --------------------------------- */


/* --------------------------------- Func Params --------------------------------- */
export interface GetPlaylistByIdFuncParams {
  playlistId: PlaylistId;
  organizationId: OrganizationId;
}

export interface GetModelByIdForOrganizationFuncParams {
  playlistId: PlaylistId;
  organizationId: OrganizationId;
}

export interface GetDTOByIdForOrganizationFuncParams {
  playlistId: PlaylistId;
  organizationId: OrganizationId;
}

export interface UpdateByIdForOrganizationFuncParams {
  playlistId: PlaylistId;
  organizationId: OrganizationId;
  fieldsToUpdate: PlaylistServiceUpdatableAttributes;
}

/* --------------------------------- Func Params --------------------------------- */

