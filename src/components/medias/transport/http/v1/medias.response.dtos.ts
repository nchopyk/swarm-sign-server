import mediasResponseAttributes from './medias.response.attributes';
import organizationsResponseDtos from '../../../../organizations/transport/http/v1/organizations.response.dtos';
import organizationsResponseAttributes from '../../../../organizations/transport/http/v1/organizations.response.attributes';
import { CollectionResource, DTOResource } from '../../../../general/general.types';
import { MediaDTO, MediaShortDTO } from '../../../service/medias.types';


const detailedDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'media.detail' },
    id: mediasResponseAttributes.media.id,
    name: mediasResponseAttributes.media.name,
    notes: mediasResponseAttributes.media.notes,
    content: mediasResponseAttributes.media.content,
    thumbnail: mediasResponseAttributes.media.thumbnail,
    type: mediasResponseAttributes.media.type,
    duration: mediasResponseAttributes.media.duration,
    width: mediasResponseAttributes.media.width,
    height: mediasResponseAttributes.media.height,
    mimeType: mediasResponseAttributes.media.mimeType,
    size: mediasResponseAttributes.media.size,
    createdAt: mediasResponseAttributes.media.createdAt,
    updatedAt: mediasResponseAttributes.media.updatedAt,
    organization: organizationsResponseDtos.shortDTO,
  } satisfies DTOResource<MediaDTO>,
};

const shortDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'media.short' },
    id: mediasResponseAttributes.media.id,
    organizationId: organizationsResponseAttributes.organization.id,
    name: mediasResponseAttributes.media.name,
    notes: mediasResponseAttributes.media.notes,
    content: mediasResponseAttributes.media.content,
    thumbnail: mediasResponseAttributes.media.thumbnail,
    type: mediasResponseAttributes.media.type,
    duration: mediasResponseAttributes.media.duration,
    width: mediasResponseAttributes.media.width,
    height: mediasResponseAttributes.media.height,
    mimeType: mediasResponseAttributes.media.mimeType,
    size: mediasResponseAttributes.media.size,
    createdAt: mediasResponseAttributes.media.createdAt,
    updatedAt: mediasResponseAttributes.media.updatedAt,
  } satisfies DTOResource<MediaShortDTO>,
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
  }  satisfies DTOResource<CollectionResource<MediaDTO>>,
};

const deletedSuccessfullyResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'media.deletion.success' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};


export default {
  detailedDTO,
  shortDTO,
  collectionDTO,
  deletedSuccessfullyResponseDTO,
};
