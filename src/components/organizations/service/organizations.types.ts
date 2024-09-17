export type OrganizationId = string;
export type OrganizationName = string;
export type OrganizationCreatedAt = Date;
export type OrganizationUpdatedAt = Date;


/* --------------------- Organization Model --------------------- */
export interface OrganizationModel {
  id: OrganizationId;
  name: OrganizationName;
  createdAt: OrganizationCreatedAt;
  updatedAt: OrganizationUpdatedAt;
}

export interface OrganizationCreationAttributes {
  name: OrganizationName;
}

export type OrganizationUpdatableAttributes = Partial<Omit<OrganizationModel, 'id' | 'createdAt' | 'updatedAt'>>;
/* --------------------- Organization Model --------------------- */


/* --------------------- Organization DTOs --------------------- */
export type OrganizationShortDTO = OrganizationModel;

export type PrefixedOrganizationDTO = {
  [K in keyof OrganizationModel as `organization.${K}`]: OrganizationModel[K]
};

export type PrefixedOrganizationShortDTO = {
  [K in keyof OrganizationShortDTO as `organization.${K}`]: OrganizationShortDTO[K]
}
/* --------------------- Organization DTOs --------------------- */


/* --------------------- Functions Params --------------------- */

/* --------------------- Functions Params --------------------- */
