import { ApiError } from '../../../errors/error.types';
import { CreateOrganizationFunctionParams, UserEmail, UserId } from './users.types';
import { OrganizationId } from '../../organizations/service/organizations.types';


const usersErrors = {
  withSuchEmailAlreadyExists: (context: { email: UserEmail }): ApiError => ({
    errorType: 'user.withSuchEmailAlreadyExists',
    message: 'User with such email already exists',
    context
  }),

  wrongEmailOrPasswordProvided: (): ApiError => ({
    errorType: 'user.wrongEmailOrPasswordProvided',
    message: 'Wrong email or password',
  }),

  emailNotVerified: (context: { email: UserEmail }): ApiError => ({
    errorType: 'user.emailNotVerified',
    message: 'Email not verified, please verify your email first',
    context
  }),

  emailAlreadyVerified: (context: { email: UserEmail }): ApiError => ({
    errorType: 'user.emailAlreadyVerified',
    message: 'Email already verified',
    context
  }),

  withSuchEmailNotFound: (context: { email: UserEmail }): ApiError => ({
    errorType: 'user.withSuchEmailNotFound',
    message: 'User with such email not found',
    context
  }),

  withSuchIdNotFound: (context: { userId: UserId }): ApiError => ({
    errorType: 'user.withSuchIdNotFound',
    message: 'User not found',
    context
  }),

  invalidJWTRecoveryToken: (): ApiError => ({
    errorType: 'user.invalidJWTRecoveryToken',
    message: 'Invalid recovery token',
  }),

  recoveryTokenAlreadyUsedOrCancelled: (): ApiError => ({
    errorType: 'user.recoveryTokenAlreadyUsedOrCancelled',
    message: 'Recovery token already used or user has already logged in the account after a password recovery request',
  }),

  wrongCurrentPassword: (): ApiError => ({
    errorType: 'user.wrongCurrentPassword',
    message: 'Wrong current password',
  }),

  userNotBelongsToOrganization: (context: { userId: UserId, organizationId: OrganizationId }): ApiError => ({
    errorType: 'user.notBelongsToOrganization',
    message: 'User does not belong to this organization',
    context
  }),

  userAlreadyBelongsToOrganization: (context: { userId: UserId, organizationId: OrganizationId }): ApiError => ({
    errorType: 'user.alreadyBelongsToOrganization',
    message: 'User already belongs to this organization',
    context
  }),

  ownerCannotLeaveOrganization: (context: { userId: UserId, organizationId: OrganizationId}): ApiError => ({
    errorType: 'user.ownerCannotLeaveOrganization',
    message: 'Owner cannot leave organization',
    context
  }),

  unauthorized: (): ApiError => ({
    errorType: 'user.unauthorized',
    message: 'Unauthorized',
  }),

  notPermissionForThisAction: (context: { userId: UserId }): ApiError => ({
    errorType: 'user.notPermissionForThisAction',
    message: 'User do not have permission for this action',
    context
  }),

  organizationNotCreated: (context: CreateOrganizationFunctionParams): ApiError => ({
    errorType: 'user.organizationNotCreated',
    message: 'Organization not created',
    context
  }),

  cannotPerformActionOnYourself: (context: { userId: UserId }): ApiError => ({
    errorType: 'user.cannotPerformActionOnYourself',
    message: 'User cannot perform this action on yourself',
    context
  }),

  relationNotCreated: (context: { userId: UserId, organizationId: OrganizationId }): ApiError => ({
    errorType: 'user.relationNotCreated',
    message: 'Relation with organization not created',
    context
  }),

};

export default usersErrors;
