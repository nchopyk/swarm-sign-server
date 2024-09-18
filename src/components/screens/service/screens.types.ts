import { OrganizationId, OrganizationShortDTO } from '../../organizations/service/organizations.types';

export type ScreenId = string;
export type ScreenName = string;
export type ScreenNotes = string | null;
export type ScreenDeviceId = string | null;
export type ScreenLocation = string | null;
export type ScreenCreatedAt = Date;
export type ScreenUpdatedAt = Date;


/* --------------------------------- Screen Model --------------------------------- */
export interface ScreenModel {
  id: ScreenId;
  organizationId: OrganizationId;
  name: ScreenName;
  notes: ScreenNotes;
  deviceId: ScreenDeviceId;
  location: ScreenLocation;
  createdAt: ScreenCreatedAt;
  updatedAt: ScreenUpdatedAt;
}


export type ScreenCreationAttributes = Omit<ScreenModel, 'id' | 'createdAt' | 'updatedAt' | 'deviceId'>;
export type ScreenServiceUpdatableAttributes = Partial<Omit<ScreenModel, 'id' | 'createdAt' | 'updatedAt' | 'organizationId' | 'deviceId'>>;
export type ScreenRepositoryUpdatableAttributes = Partial<Omit<ScreenModel, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>>;
/* --------------------------------- Screen Model --------------------------------- */


/* --------------------------------- Screen DTOs --------------------------------- */
export interface ScreenDTO extends Omit<ScreenModel, 'organizationId'> {
  organization: OrganizationShortDTO;
}

/* --------------------------------- Screen DTOs --------------------------------- */


/* --------------------------------- Func Params --------------------------------- */
export interface GetScreenByIdFuncParams {
  screenId: ScreenId;
  organizationId: OrganizationId;
}

export interface GetModelByIdForOrganizationFuncParams {
  screenId: ScreenId;
  organizationId: OrganizationId;
}

export interface GetDTOByIdForOrganizationFuncParams {
  screenId: ScreenId;
  organizationId: OrganizationId;
}

export interface UpdateByIdForOrganizationFuncParams {
  screenId: ScreenId;
  organizationId: OrganizationId;
  fieldsToUpdate: ScreenServiceUpdatableAttributes;
}

/* --------------------------------- Func Params --------------------------------- */

