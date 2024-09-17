import { ApiError } from '../../../errors/error.types';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { InvitationId } from './organizations-members.types';
import { UserEmail, UserId } from '../../users/service/users.types';

const organizationsMembersErrors = {
  organizationNotRelatedToUser: (context: { organizationId: OrganizationId, userId: UserId }): ApiError => ({
    errorType: 'organization.notRelatedToUser',
    message: 'Organization not related to user',
    context
  }),

  invitedUserAlreadyInOrganization: (context: { organizationId: OrganizationId, userId: UserId }): ApiError => ({
    errorType: 'organization.invitedUserAlreadyInOrganization',
    message: 'Invited user already in organization',
    context
  }),

  invitationWithSuchIdNotFound: (context: { organizationId: OrganizationId, invitationId: InvitationId }): ApiError => ({
    errorType: 'organization.invitationWithSuchIdNotFound',
    message: 'Invitation not found',
    context
  }),

  invitationAlreadySentToUser: (context: { organizationId: OrganizationId, userEmail: UserEmail }): ApiError => ({
    errorType: 'organization.invitationAlreadySentToUser',
    message: 'Invitation already sent to user',
    context
  }),

  respondedInvitationCannotBeCanceled: (context: { organizationId: OrganizationId, invitationId: InvitationId }): ApiError => ({
    errorType: 'organization.respondedInvitationCannotBeCanceled',
    message: 'Responded invitation cannot be canceled',
    context
  }),


  relationNotFound: (context: { organizationId: OrganizationId, userId: UserId }): ApiError => ({
    errorType: 'organization.relationNotFound',
    message: 'Organization relation not found',
    context
  }),

};

export default organizationsMembersErrors;
