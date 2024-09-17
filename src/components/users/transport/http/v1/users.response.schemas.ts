import usersDTOs from './users.response.dtos';

const responsesSchemas = {
  signUp: {
    201: usersDTOs.accountCreatedResponseDTO,
  },

  signUpInvitedUser: {
    200: usersDTOs.loginSuccessfulResponseDTO,
  },

  verifyEmail: {
    200: usersDTOs.loginSuccessfulResponseDTO,
  },

  resendVerificationEmail: {
    200: usersDTOs.verificationEmailSentResponseDTO,
  },

  login: {
    200: usersDTOs.loginSuccessfulResponseDTO,
  },

  getCurrentUser: {
    200: usersDTOs.detailedDTO,
  },

  recoverPassword: {
    200: usersDTOs.recoverPasswordResponseDTO,
  },

  resetPassword: {
    200: usersDTOs.loginSuccessfulResponseDTO,
  },

  refreshToken: {
    200: usersDTOs.tokensDTO,
  },

  updateCurrentUser: {
    200: usersDTOs.detailedDTO,
  },

  deleteCurrentUser: {
    200: usersDTOs.deleteAccountWithOrganizationsSuccessfulResponseDTO,
  },

  createUserOrganization: {
    201: usersDTOs.userOrganizationDTO
  },

  getAllUserOrganizationsWithPagination: {
    200: usersDTOs.userOrganizationsCollectionDTO,
  },

  getUserOrganizationById: {
    200: usersDTOs.userOrganizationDTO,
  },

  leaveOrganization: {
    200: usersDTOs.leaveOrganizationResponseDTO,
  },

  getAllInvitationsToOrganizationsWithPagination: {
    200: usersDTOs.userInvitationsToOrganizationsCollectionDTO,
  },

  acceptInvitationToOrganization: {
    200: usersDTOs.acceptInvitationToOrganizationResponseDTO
  },

  rejectInvitationToOrganization: {
    200: usersDTOs.rejectInvitationToOrganizationResponseDTO
  },

};

export default responsesSchemas;
