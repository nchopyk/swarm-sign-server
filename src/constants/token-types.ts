export const TOKEN_TYPES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  EMAIL_VERIFICATION_TOKEN: 'email_verification_token',
  PASSWORD_RECOVERY_TOKEN: 'password_recovery_token',
  ORGANIZATION_INVITATION_TOKEN: 'organization_invitation_token',
} as const;

export type TokenTypeValue = typeof TOKEN_TYPES[keyof typeof TOKEN_TYPES];

export default TOKEN_TYPES;
