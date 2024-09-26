import { CollectionResource, DTOResource } from '../../../../general/general.types';
import { PlaylistDTO, PlaylistMediaDTO } from '../../../service/playlists.types';
import playlistsResponseAttributes from './playlists.response.attributes';
import organizationsResponseDtos from '../../../../organizations/transport/http/v1/organizations.response.dtos';
import mediasResponseDtos from '../../../../medias/transport/http/v1/medias.response.dtos';

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
  }  satisfies DTOResource<CollectionResource<PlaylistDTO>>,
};

const deletedSuccessfullyResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'playlist.deletion.success' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const playlistMediaDetailedDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'playlist.media.detail' },
    id: playlistsResponseAttributes.playlistMedia.id,
    duration: playlistsResponseAttributes.playlistMedia.duration,
    createdAt: playlistsResponseAttributes.playlistMedia.createdAt,
    updatedAt: playlistsResponseAttributes.playlistMedia.updatedAt,
    media: mediasResponseDtos.shortDTO,
  } satisfies DTOResource<PlaylistMediaDTO>,
};

const playlistMediaListDTO = {
  type: 'array',
  items: playlistMediaDetailedDTO,
};

const playlistMediasCollectionDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'collection' },
    dataType: { type: 'string', default: playlistMediaDetailedDTO.properties.resourceType.default },
    data: playlistMediaListDTO,
  }  satisfies DTOResource<CollectionResource<PlaylistMediaDTO>>,
};

export default {
  detailedDTO,
  collectionDTO,
  deletedSuccessfullyResponseDTO,
  playlistMediaDetailedDTO,
  playlistMediasCollectionDTO,
};
