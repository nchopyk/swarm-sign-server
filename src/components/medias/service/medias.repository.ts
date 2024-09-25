import postgresClient from '../../../modules/postgres-db';
import organizationsRepository from '../../organizations/service/organizations.repository';
import crypto from 'node:crypto';
import { addTablePrefixToColumns, convertFieldsToColumns } from '../../general/utils/general.repository.utils';
import { convertModelSortRulesToTableSortRules } from '../../../modules/collection-query-processor/sort/sort.rules-converters';
import { convertFiltersToQueryCondition } from '../../../modules/collection-query-processor/filter/filter.knex-condition-builder';
import { OrganizationId, OrganizationModel } from '../../organizations/service/organizations.types';
import { Knex } from 'knex';
import { CollectionRepositoryOptions, CollectionWhere, ModelToColumnsMapping, ModelToPrefixedColumnsMapping } from '../../general/general.types';
import {
  MediaServiceRepositoryAttributes,
  MediaRepositoryUpdatableAttributes,
  GetDTOByIdForOrganizationFuncParams,
  GetModelByIdForOrganizationFuncParams,
  MediaModel, MediaId, MediaDTO
} from './medias.types';


export class MediasRepository {
  public readonly mediaModelToTableColumnMap: ModelToColumnsMapping<MediaModel> = {
    id: 'id',
    organizationId: 'organization_id',
    name: 'name',
    notes: 'notes',
    content: 'content',
    type: 'type',
    duration: 'duration',
    width: 'width',
    height: 'height',
    mimeType: 'mime_type',
    size: 'size',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  public readonly mediaModelToPrefixedColumnsColumnMap = addTablePrefixToColumns(this.mediaModelToTableColumnMap, 'media');

  public readonly mediaDTOColumnMap: ModelToPrefixedColumnsMapping = {
    ...this.mediaModelToPrefixedColumnsColumnMap,
    ...organizationsRepository.organizationsModelToPrefixedColumnsMapWithAliases,
  };

  constructor(private postgresClient: Knex) {
    this.postgresClient = postgresClient;
  }

  async create(newMediaData: MediaServiceRepositoryAttributes, trx?: Knex.Transaction): Promise<MediaId> {
    const id = crypto.randomUUID();
    const columns = convertFieldsToColumns({ ...newMediaData, id }, this.mediaModelToTableColumnMap);

    await (trx || this.postgresClient)
      .insert(columns)
      .into('medias');

    return id;
  }

  async getModelById(id: MediaId, trx?: Knex.Transaction): Promise<MediaModel | null> {
    return (trx || this.postgresClient)
      .select(this.mediaModelToTableColumnMap)
      .from('medias')
      .where('id', id)
      .first();
  }

  async getModelByIdForOrganization({ mediaId, organizationId }: GetModelByIdForOrganizationFuncParams, trx?: Knex.Transaction): Promise<MediaModel | null> {
    return (trx || this.postgresClient)
      .select(this.mediaModelToTableColumnMap)
      .from('medias')
      .where('id', mediaId)
      .andWhere('organization_id', organizationId)
      .first();
  }

  async getDTOByIdForOrganization({ mediaId, organizationId }: GetDTOByIdForOrganizationFuncParams, trx?: Knex.Transaction): Promise<MediaDTO | null> {
    const mediaRows = await (trx || this.postgresClient)
      .select(this.mediaDTOColumnMap)
      .from('medias as media')
      .join('organizations as organization', 'media.organization_id', 'organization.id')
      .where('media.id', mediaId)
      .andWhere('media.organization_id', organizationId)
      .first();


    return mediaRows ? this.toMediaDTO(mediaRows) : null;
  }

  async getDTOsCollectionForOrganization(organizationId: OrganizationId, collectionOptions: CollectionRepositoryOptions): Promise<MediaDTO[]> {
    const mediaRows = await this.postgresClient
      .select(this.mediaDTOColumnMap)
      .from('medias as media')
      .join('organizations as organization', 'media.organization_id', 'organization.id')
      .where('media.organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, collectionOptions.where, this.mediaDTOColumnMap))
      .orderBy(convertModelSortRulesToTableSortRules(collectionOptions.sort, this.mediaDTOColumnMap))
      .limit(collectionOptions.limit)
      .offset(collectionOptions.skip);

    return mediaRows.map((mediaRow) => this.toMediaDTO(mediaRow));
  }

  async getDTOsCollectionTotalCountForOrganization(organizationId: OrganizationId, filters: CollectionWhere): Promise<number> {
    const result: { count: string } = await this.postgresClient
      .count('media.id')
      .from('medias as media')
      .join('organizations as organization', 'media.organization_id', 'organization.id')
      .where('media.organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, filters, this.mediaDTOColumnMap))
      .first();

    return parseInt(result.count, 10);
  }

  async update(mediaId: MediaId, fieldsToUpdate: MediaRepositoryUpdatableAttributes, trx?: Knex.Transaction): Promise<void> {
    const columns = convertFieldsToColumns(fieldsToUpdate, this.mediaModelToTableColumnMap);

    if (Object.keys(columns).length === 0) {
      return;
    }

    console.log('columns', columns);

    await (trx || this.postgresClient)
      .update(columns)
      .from('medias')
      .where('id', mediaId);
  }

  async delete(mediaId: MediaId, trx?: Knex.Transaction): Promise<void> {
    await (trx || this.postgresClient)
      .delete()
      .from('medias')
      .where('id', mediaId);
  }

  public toMediaDTO(mediaRows: MediaModel): MediaDTO {
    const mediaModel = {} as MediaModel;
    const organizationModel = {} as OrganizationModel;

    for (const [key, value] of Object.entries(mediaRows)) {
      const [table, column] = key.split('.');

      if (table && !column) {
        // table is the column name
        mediaModel[table] = value;
      } else if (table === 'organization') {
        organizationModel[column] = value;
      }
    }

    return {
      ...mediaModel,
      organization: organizationModel,
    };
  }
}


export default new MediasRepository(postgresClient.getClient());
