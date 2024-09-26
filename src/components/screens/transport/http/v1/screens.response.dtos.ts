import { CollectionResource, DTOResource } from '../../../../general/general.types';
import { ScreenDTO } from '../../../service/screens.types';
import screensResponseAttributes from './screens.response.attributes';
import organizationsResponseDtos from '../../../../organizations/transport/http/v1/organizations.response.dtos';


const detailedDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'screen.detail' },
    id: screensResponseAttributes.screen.id,
    name: screensResponseAttributes.screen.name,
    notes: screensResponseAttributes.screen.notes,
    deviceId: screensResponseAttributes.screen.deviceId,
    location: screensResponseAttributes.screen.location,
    createdAt: screensResponseAttributes.screen.createdAt,
    updatedAt: screensResponseAttributes.screen.updatedAt,
    organization: organizationsResponseDtos.shortDTO,
  } satisfies DTOResource<ScreenDTO>,
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
  }  satisfies DTOResource<CollectionResource<ScreenDTO>>,
};

const activatedSuccessfullyResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'screen.activation.success' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};

const deletedSuccessfullyResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'screen.deletion.success' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};


export default {
  detailedDTO,
  collectionDTO,
  activatedSuccessfullyResponseDTO,
  deletedSuccessfullyResponseDTO,
};
