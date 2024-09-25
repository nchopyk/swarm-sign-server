import { OrganizationId, OrganizationShortDTO } from '../../organizations/service/organizations.types';

export type PlaylistId = string;
export type PlaylistName = string;
export type PlaylistNotes = string | null;
export type PlaylistCreatedAt = Date;
export type PlaylistUpdatedAt = Date;


/* --------------------------------- Playlist Model --------------------------------- */
export interface PlaylistModel {
  id: PlaylistId;
  organizationId: OrganizationId;
  name: PlaylistName;
  notes: PlaylistNotes;
  createdAt: PlaylistCreatedAt;
  updatedAt: PlaylistUpdatedAt;
}


export type PlaylistCreationAttributes = Omit<PlaylistModel, 'id' | 'createdAt' | 'updatedAt' | 'deviceId'>;
export type PlaylistServiceUpdatableAttributes = Partial<Omit<PlaylistModel, 'id' | 'createdAt' | 'updatedAt' | 'organizationId' >>;
export type PlaylistRepositoryUpdatableAttributes = Partial<Omit<PlaylistModel, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>>;
/* --------------------------------- Playlist Model --------------------------------- */


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

