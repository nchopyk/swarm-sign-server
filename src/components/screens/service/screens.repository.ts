import postgresClient from '../../../modules/postgres-db';
import { Knex } from 'knex';
import { CollectionOptions, CollectionWhere, ModelToColumnsMapping, ModelToPrefixedColumnsMapping } from '../../general/general.types';
import {
  ScreenModel,
  ScreenCreationAttributes,
  ScreenId,
  ScreenDTO,
  ScreenRepositoryUpdatableAttributes,
  GetDTOByIdForOrganizationFuncParams,
  GetModelByIdForOrganizationFuncParams
} from './screens.types';
import crypto from 'node:crypto';
import { addTablePrefixToColumns, convertFieldsToColumns } from '../../general/utils/general.repository.utils';
import { OrganizationId, OrganizationModel } from '../../organizations/service/organizations.types';
import { convertModelSortRulesToTableSortRules } from '../../../modules/collection-query-processor/sort/sort.rules-converters';
import organizationsRepository from '../../organizations/service/organizations.repository';
import { convertFiltersToQueryCondition } from '../../../modules/collection-query-processor/filter/filter.knex-condition-builder';


export class ScreensRepository {
  public readonly screenModelToTableColumnMap: ModelToColumnsMapping<ScreenModel> = {
    id: 'id',
    organizationId: 'organization_id',
    name: 'name',
    notes: 'notes',
    deviceId: 'device_id',
    location: 'location',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  public readonly screenModelToPrefixedColumnsColumnMap = addTablePrefixToColumns(this.screenModelToTableColumnMap, 'screen');

  public readonly screenDTOColumnMap: ModelToPrefixedColumnsMapping = {
    ...this.screenModelToPrefixedColumnsColumnMap,
    ...organizationsRepository.organizationsModelToPrefixedColumnsMapWithAliases,
  };

  constructor(private postgresClient: Knex) {
    this.postgresClient = postgresClient;
  }

  async create(newScreenData: ScreenCreationAttributes, trx?: Knex.Transaction): Promise<ScreenId> {
    const id = crypto.randomUUID();
    const columns = convertFieldsToColumns({ ...newScreenData, id }, this.screenModelToTableColumnMap);

    await (trx || this.postgresClient)
      .insert(columns)
      .into('screens');

    return id;
  }

  async getModelById(id: ScreenId, trx?: Knex.Transaction): Promise<ScreenModel | null> {
    return (trx || this.postgresClient)
      .select(this.screenModelToTableColumnMap)
      .from('screens')
      .where('id', id)
      .first();
  }

  async getModelByIdForOrganization({ screenId, organizationId }: GetModelByIdForOrganizationFuncParams, trx?: Knex.Transaction): Promise<ScreenModel | null> {
    return (trx || this.postgresClient)
      .select(this.screenModelToTableColumnMap)
      .from('screens')
      .where('id', screenId)
      .andWhere('organization_id', organizationId)
      .first();
  }

  async getDTOByIdForOrganization({ screenId, organizationId }: GetDTOByIdForOrganizationFuncParams, trx?: Knex.Transaction): Promise<ScreenDTO | null> {
    const screenRows = await (trx || this.postgresClient)
      .select(this.screenDTOColumnMap)
      .from('screens as screen')
      .join('organizations as organization', 'screen.organization_id', 'organization.id')
      .where('screen.id', screenId)
      .andWhere('screen.organization_id', organizationId)
      .first();


    return screenRows ? this.toScreenDTO(screenRows) : null;
  }

  async getDTOsCollectionForOrganization(organizationId: OrganizationId, collectionOptions: CollectionOptions): Promise<ScreenDTO[]> {
    const screenRows = await this.postgresClient
      .select(this.screenDTOColumnMap)
      .from('screens as screen')
      .join('organizations as organization', 'screen.organization_id', 'organization.id')
      .where('screen.organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, collectionOptions.where, this.screenDTOColumnMap))
      .orderBy(convertModelSortRulesToTableSortRules(collectionOptions.sort, this.screenDTOColumnMap));

    return screenRows.map((screenRow) => this.toScreenDTO(screenRow));
  }

  async getDTOsCollectionTotalCountForOrganization(organizationId: OrganizationId, filters: CollectionWhere): Promise<number> {
    const result: { count: string } = await this.postgresClient
      .count('screen.id')
      .from('screens as screen')
      .join('organizations as organization', 'screen.organization_id', 'organization.id')
      .where('screen.organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, filters, this.screenDTOColumnMap))
      .first();

    return parseInt(result.count, 10);
  }

  async update(screenId: ScreenId, fieldsToUpdate: ScreenRepositoryUpdatableAttributes, trx?: Knex.Transaction): Promise<void> {
    const columns = convertFieldsToColumns(fieldsToUpdate, this.screenModelToTableColumnMap);

    if (Object.keys(columns).length === 0) {
      return;
    }

    await (trx || this.postgresClient)
      .update(columns)
      .from('screens')
      .where('id', screenId);
  }

  async delete(screenId: ScreenId, trx?: Knex.Transaction): Promise<void> {
    await (trx || this.postgresClient)
      .delete()
      .from('screens')
      .where('id', screenId);
  }

  public toScreenDTO(screenRows: ScreenModel): ScreenDTO {
    const screenModel = {} as ScreenModel;
    const organizationModel = {} as OrganizationModel;

    for (const [key, value] of Object.entries(screenRows)) {
      const [table, column] = key.split('.');

      if (table && !column) {
        // table is the column name
        screenModel[table] = value;
      } else if (table === 'organization') {
        organizationModel[column] = value;
      }
    }

    return {
      ...screenModel,
      organization: organizationModel,
    };
  }
}


export default new ScreensRepository(postgresClient.getClient());
