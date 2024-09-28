import { OrganizationId, OrganizationShortDTO } from '../../organizations/service/organizations.types';
import { PlaylistShortDTO } from '../../playlists/service/playlists.types';
import { ScreenShortDTO } from '../../screens/service/screens.types';

export type ScheduleId = string;
export type ScheduleName = string;
export type ScheduleNotes = string | null;
export type ScheduleCreatedAt = Date;
export type ScheduleUpdatedAt = Date;


/* --------------------------------- Schedule Model --------------------------------- */
export interface ScheduleModel {
  id: ScheduleId;
  organizationId: OrganizationId;
  screenId: ScheduleId;
  playlistId: ScheduleId;
  name: ScheduleName;
  notes: ScheduleNotes;
  createdAt: ScheduleCreatedAt;
  updatedAt: ScheduleUpdatedAt;
}


export type ScheduleCreationAttributes = Omit<ScheduleModel, 'id' | 'createdAt' | 'updatedAt'>;
export type ScheduleServiceUpdatableAttributes = Partial<Omit<ScheduleModel, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>>;
export type ScheduleRepositoryUpdatableAttributes = Partial<Omit<ScheduleModel, 'id' | 'createdAt' | 'updatedAt'>>;
/* --------------------------------- Schedule Model --------------------------------- */


/* --------------------------------- Schedule DTOs --------------------------------- */
export interface ScheduleDTO extends Omit<ScheduleModel, 'organizationId' | 'screenId' | 'playlistId'> {
  organization: OrganizationShortDTO;
  screen: ScreenShortDTO;
  playlist: PlaylistShortDTO;
}

/* --------------------------------- Schedule DTOs --------------------------------- */


/* --------------------------------- Func Params --------------------------------- */
export interface GetScheduleByIdFuncParams {
  scheduleId: ScheduleId;
  organizationId: OrganizationId;
}

export interface GetModelByIdForOrganizationFuncParams {
  scheduleId: ScheduleId;
  organizationId: OrganizationId;
}

export interface GetDTOByIdForOrganizationFuncParams {
  scheduleId: ScheduleId;
  organizationId: OrganizationId;
}

export interface UpdateByIdForOrganizationFuncParams {
  scheduleId: ScheduleId;
  organizationId: OrganizationId;
  fieldsToUpdate: ScheduleServiceUpdatableAttributes;
}

/* --------------------------------- Func Params --------------------------------- */

