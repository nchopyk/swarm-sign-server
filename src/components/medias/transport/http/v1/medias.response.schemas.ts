import mediasDTOs from './medias.response.dtos';


const mediasValidationSchemas = {
  create: {
    200: mediasDTOs.detailedDTO,
  },

  getAllForOrganization: {
    200: mediasDTOs.collectionDTO,
  },

  getByIdForOrganization: {
    200: mediasDTOs.detailedDTO,
  },

  updateByIdForOrganization: {
    200: mediasDTOs.detailedDTO,
  },

  deleteByIdForOrganization: {
    200: mediasDTOs.deletedSuccessfullyResponseDTO,
  },
};


export default mediasValidationSchemas;
