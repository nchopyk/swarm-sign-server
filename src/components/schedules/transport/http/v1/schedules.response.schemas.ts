import screensDTOs from './schedules.response.dtos';


const screensValidationSchemas = {
  create: {
    200: screensDTOs.detailedDTO,
  },

  getAllForOrganization: {
    200: screensDTOs.collectionDTO,
  },

  getByIdForOrganization: {
    200: screensDTOs.detailedDTO,
  },

  updateByIdForOrganization: {
    200: screensDTOs.detailedDTO,
  },

  deleteByIdForOrganization: {
    200: screensDTOs.deletedSuccessfullyResponseDTO,
  },

  getScreenSchedule: {
    200: screensDTOs.screenScheduleDTO,
  }
};


export default screensValidationSchemas;
