import schedulesResponseAttributes from './schedules.response.attributes';
import organizationsResponseDtos from '../../../../organizations/transport/http/v1/organizations.response.dtos';
import { CollectionResource, DTOResource } from '../../../../general/general.types';
import { ScheduleDTO, ScreenScheduleDTO } from '../../../service/schedules.types';
import playlistsResponseDtos from '../../../../playlists/transport/http/v1/playlists.response.dtos';

const detailedDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'schedule.detail' },
    id: schedulesResponseAttributes.schedule.id,
    name: schedulesResponseAttributes.schedule.name,
    notes: schedulesResponseAttributes.schedule.notes,
    createdAt: schedulesResponseAttributes.schedule.createdAt,
    updatedAt: schedulesResponseAttributes.schedule.updatedAt,
    organization: organizationsResponseDtos.shortDTO,
    screen: organizationsResponseDtos.shortDTO,
    playlist: organizationsResponseDtos.shortDTO,
  } satisfies DTOResource<ScheduleDTO>,
};

const screenScheduleDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'screen.schedule.detail' },
    schedule: detailedDTO,
    playlist: playlistsResponseDtos.shortDTO,
    medias: playlistsResponseDtos.playlistMediasCollectionDTO,
  } satisfies DTOResource<ScreenScheduleDTO>,
};


const listDTO = {
  type: 'array',
  items: detailedDTO,
};

const collectionDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'collection' },
    dataType: { type: 'string', default: detailedDTO.properties.resourceType.default },
    data: listDTO,
  }  satisfies DTOResource<CollectionResource<ScheduleDTO>>,
};

const activatedSuccessfullyResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'schedule.activation.success' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const deletedSuccessfullyResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'schedule.deletion.success' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};


export default {
  detailedDTO,
  collectionDTO,
  screenScheduleDTO,
  activatedSuccessfullyResponseDTO,
  deletedSuccessfullyResponseDTO,
};
