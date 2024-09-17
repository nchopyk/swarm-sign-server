import transmittersDTOs from './screens.response.dtos';

const screensValidationSchemas = {
  activate: {
    200: transmittersDTOs.activatedSuccessfullyResponseDTO,
  },
};

export default screensValidationSchemas;
