import organizationsDTOs from './organizations.response.dtos';

const responsesSchemas = {
  create: {
    200: organizationsDTOs.detailedDTO,
  },

  getById: {
    200: organizationsDTOs.detailedDTO,
  },

  update: {
    200: organizationsDTOs.detailedDTO,
  },

  delete: {
    200: organizationsDTOs.deletedDTO
  },
};

export default responsesSchemas;
