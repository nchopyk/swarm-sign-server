import { CollectionResource, DTOResource } from '../../../../general/general.types';
import { PlaylistDTO } from '../../../service/playlists.types';
import playlistsResponseAttributes from './playlists.response.attributes';
import organizationsResponseDtos from '../../../../organizations/transport/http/v1/organizations.response.dtos';
import { paginationDTO } from '../../../../general/general.response.dto';

const detailedDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'playlist.detail' },
    id: playlistsResponseAttributes.playlist.id,
    name: playlistsResponseAttributes.playlist.name,
    notes: playlistsResponseAttributes.playlist.notes,
    createdAt: playlistsResponseAttributes.playlist.createdAt,
    updatedAt: playlistsResponseAttributes.playlist.updatedAt,
    organization: organizationsResponseDtos.shortDTO,
  } satisfies DTOResource<PlaylistDTO>,
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
    meta: paginationDTO,
  }  satisfies DTOResource<CollectionResource<PlaylistDTO>>,
};

const activatedSuccessfullyResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'playlist.activation.success' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const deletedSuccessfullyResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'playlist.deletion.success' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};


export default {
  detailedDTO,
  collectionDTO,
  activatedSuccessfullyResponseDTO,
  deletedSuccessfullyResponseDTO,
};
