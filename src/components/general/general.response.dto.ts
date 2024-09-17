import { DTOResource, Pagination, ResponseAttributes } from './general.types';

export const paginationDTO = {
  type: 'object',
  nullable: false,
  properties: {
    from: { type: 'number' },
    to: { type: 'number' },
    total: { type: 'number' },
    pageSize: { type: 'number' },
    currentPage: { type: 'number' },
    lastPage: { type: 'number' },
  } satisfies ResponseAttributes<Pagination>,
};

export const coordinatesDTO = {
  type: 'object',
  nullable: false,
  properties: {
    lat: { type: 'number' },
    lng: { type: 'number' },
  },
};

export const countDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'collection.count' },
    count: { type: 'number' },
  } satisfies DTOResource<Record<string, number>>,
};


export default {
  paginationDTO,
  coordinatesDTO,
  countDTO,
};
