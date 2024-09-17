import organizationsMembersDTOs from './organizations-members.response.dtos';

const responsesSchemas = {
  getAllOrganizationMembers: {
    200: organizationsMembersDTOs.membersCollectionDTO
  },

  updateOrganizationMemberById: {
    200: organizationsMembersDTOs.memberDTO
  },

  excludeMemberFromOrganization: {
    200: organizationsMembersDTOs.excludeMemberResponseDTO
  },

  inviteUserToOrganization: {
    200: organizationsMembersDTOs.inviteMemberResponseDTO
  },

  cancelOrganizationInvitation: {
    200: organizationsMembersDTOs.deleteInvitationResponseDTO
  },
};

export default responsesSchemas;
