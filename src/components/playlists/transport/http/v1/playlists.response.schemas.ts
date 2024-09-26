import playlistsDTOs from './playlists.response.dtos';

const playlistsValidationSchemas = {
  create: {
    200: playlistsDTOs.detailedDTO,
  },

  getAllForOrganization: {
    200: playlistsDTOs.collectionDTO,
  },

  getByIdForOrganization: {
    200: playlistsDTOs.detailedDTO,
  },

  getPlaylistMedias: {
    200: playlistsDTOs.playlistMediasCollectionDTO,
  },

  updateByIdForOrganization: {
    200: playlistsDTOs.detailedDTO,
  },

  deleteByIdForOrganization: {
    200: playlistsDTOs.deletedSuccessfullyResponseDTO,
  },
};

export default playlistsValidationSchemas;
