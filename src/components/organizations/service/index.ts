import Errors from '../../../errors';
import organizationsErrors from './organizations.errors';
import organizationsRepository from './organizations.repository';
import {
  OrganizationId,
  OrganizationModel,
  OrganizationUpdatableAttributes,
} from './organizations.types';


export class OrganizationsService {
  async getById(organizationId: OrganizationId): Promise<OrganizationModel> {
    const organization = await organizationsRepository.getModelById(organizationId);

    if (!organization) {
      throw new Errors.NotFoundError(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    return organization;
  }

  async update(organizationId: OrganizationId, fieldsToUpdate: Partial<OrganizationUpdatableAttributes>): Promise<OrganizationModel | null> {
    const organization = await organizationsRepository.getModelById(organizationId);

    if (!organization) {
      throw new Errors.NotFoundError(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    await organizationsRepository.update(organizationId, fieldsToUpdate);

    return organizationsRepository.getModelById(organizationId);
  }

  async delete(organizationId: OrganizationId): Promise<void> {
    const organization = await organizationsRepository.getModelById(organizationId);

    if (!organization) {
      throw new Errors.NotFoundError(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    await organizationsRepository.delete(organizationId);
  }
}

export default new OrganizationsService();
