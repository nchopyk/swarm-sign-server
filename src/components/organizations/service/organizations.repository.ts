import postgresClient from '../../../modules/postgres-db';
import { Knex } from 'knex';
import * as crypto from 'node:crypto';
import { ModelToColumnsMapping, ModelToPrefixedColumnsMapping } from '../../general/general.types';
import { addTablePrefixToColumns } from '../../general/utils/general.repository.utils';
import {
  OrganizationCreationAttributes,
  OrganizationId,
  OrganizationModel,
  OrganizationUpdatableAttributes,
} from './organizations.types';


export class OrganizationsRepository {
  public readonly organizationsModelToColumnsMap: ModelToColumnsMapping<OrganizationModel>;
  public readonly organizationsModelToPrefixedColumnsMapWithAliases: ModelToPrefixedColumnsMapping;

  constructor(private postgresClient: Knex) {
    this.postgresClient = postgresClient;

    this.organizationsModelToColumnsMap = {
      id: 'id',
      name: 'name',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };

    this.organizationsModelToPrefixedColumnsMapWithAliases = addTablePrefixToColumns(this.organizationsModelToColumnsMap, 'organization', {
      includePrefixInAliases: true
    });
  }

  async create(organization: OrganizationCreationAttributes, trx?: Knex.Transaction) {
    const newOrganizationId = crypto.randomUUID();

    await (trx || this.postgresClient)
      .insert({
        id: newOrganizationId,
        name: organization.name,
      })
      .into('organizations');

    return newOrganizationId;
  }

  async getModelById(organizationId: OrganizationId): Promise<OrganizationModel | null> {
    return this.postgresClient
      .select(this.organizationsModelToColumnsMap)
      .from('organizations')
      .where('id', organizationId)
      .first();
  }

  async update(organizationId: OrganizationId, fieldsToUpdate: Partial<OrganizationUpdatableAttributes>): Promise<void> {
    await this.postgresClient
      .update({
        name: fieldsToUpdate.name,
      })
      .from('organizations')
      .where('id', organizationId);
  }

  async delete(organizationId: OrganizationId): Promise<void> {
    await this.postgresClient
      .delete()
      .from('organizations')
      .where('id', organizationId);
  }
}

export default new OrganizationsRepository(postgresClient.getClient());
