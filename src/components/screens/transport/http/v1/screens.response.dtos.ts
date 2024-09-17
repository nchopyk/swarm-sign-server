import { DTOResource } from '../../../../general/general.types';


const activatedSuccessfullyResponseDTO = {
  type: 'object',
  properties: {
    resourceType: { type: 'string', default: 'screen.activation.success' },
    message: { type: 'string' },
  } satisfies DTOResource<{ message: string }>,
};


export default {
  activatedSuccessfullyResponseDTO
};
