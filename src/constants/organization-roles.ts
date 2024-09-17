export const ORGANIZATION_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
};

export type OrganizationRoleType = typeof ORGANIZATION_ROLES[keyof typeof ORGANIZATION_ROLES];

export default { ORGANIZATION_ROLES };
