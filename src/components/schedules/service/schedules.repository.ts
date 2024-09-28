import postgresClient from '../../../modules/postgres-db';
import { Knex } from 'knex';
import crypto from 'node:crypto';
import { addTablePrefixToColumns, convertFieldsToColumns } from '../../general/utils/general.repository.utils';
import { convertModelSortRulesToTableSortRules } from '../../../modules/collection-query-processor/sort/sort.rules-converters';
import { convertFiltersToQueryCondition } from '../../../modules/collection-query-processor/filter/filter.knex-condition-builder';
import organizationsRepository from '../../organizations/service/organizations.repository';
import screensRepository from '../../screens/service/screens.repository';
import playlistsRepository from '../../playlists/service/playlists.repository';
import { OrganizationId, OrganizationModel } from '../../organizations/service/organizations.types';
import { ScreenId, ScreenModel, ScreenRepositoryUpdatableAttributes } from '../../screens/service/screens.types';
import { PlaylistModel } from '../../playlists/service/playlists.types';
import { CollectionOptions, ModelToColumnsMapping, ModelToPrefixedColumnsMapping } from '../../general/general.types';
import {
  ScheduleModel,
  ScheduleCreationAttributes,
  ScheduleId,
  ScheduleDTO,
  GetDTOByIdForOrganizationFuncParams,
  GetModelByIdForOrganizationFuncParams
} from './schedules.types';


export class SchedulesRepository {
  public readonly scheduleModelToTableColumnMap: ModelToColumnsMapping<ScheduleModel> = {
    id: 'id',
    organizationId: 'organization_id',
    name: 'name',
    notes: 'notes',
    screenId: 'screen_id',
    playlistId: 'playlist_id',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  public readonly scheduleModelToPrefixedColumnsColumnMap = addTablePrefixToColumns(this.scheduleModelToTableColumnMap, 'schedule');

  public readonly scheduleDTOColumnMap: ModelToPrefixedColumnsMapping = {
    ...this.scheduleModelToPrefixedColumnsColumnMap,
    ...organizationsRepository.organizationsModelToPrefixedColumnsMapWithAliases,
    ...screensRepository.screenModelToPrefixedColumnsColumnMapWithAliases,
    ...playlistsRepository.playlistModelToPrefixedColumnsColumnMapWithAliases,
  };

  constructor(private postgresClient: Knex) {
    this.postgresClient = postgresClient;
  }

  async create(newScreenData: ScheduleCreationAttributes, trx?: Knex.Transaction): Promise<ScheduleId> {
    const id = crypto.randomUUID();
    const columns = convertFieldsToColumns({ ...newScreenData, id }, this.scheduleModelToTableColumnMap);

    await (trx || this.postgresClient)
      .insert(columns)
      .into('schedules');

    return id;
  }

  async getModelById(id: ScreenId, trx?: Knex.Transaction): Promise<ScheduleModel | null> {
    return (trx || this.postgresClient)
      .select(this.scheduleModelToTableColumnMap)
      .from('schedules')
      .where('id', id)
      .first();
  }

  async getModelByIdForOrganization({ scheduleId, organizationId }: GetModelByIdForOrganizationFuncParams, trx?: Knex.Transaction): Promise<ScheduleModel | null> {
    return (trx || this.postgresClient)
      .select(this.scheduleModelToTableColumnMap)
      .from('schedules')
      .where('id', scheduleId)
      .andWhere('organization_id', organizationId)
      .first();
  }

  async getDTOByIdForOrganization({ scheduleId, organizationId }: GetDTOByIdForOrganizationFuncParams, trx?: Knex.Transaction): Promise<ScheduleDTO | null> {
    const scheduleRows = await (trx || this.postgresClient)
      .select(this.scheduleDTOColumnMap)
      .from('schedules as schedule')
      .join('organizations as organization', 'schedule.organization_id', 'organization.id')
      .join('screens as screen', 'schedule.screen_id', 'screen.id')
      .join('playlists as playlist', 'schedule.playlist_id', 'playlist.id')
      .where('schedule.id', scheduleId)
      .andWhere('schedule.organization_id', organizationId)
      .first();

    return scheduleRows ? this.toScheduleDTO(scheduleRows) : null;
  }

  async getDTOsCollectionForOrganization(organizationId: OrganizationId, collectionOptions: CollectionOptions): Promise<ScheduleDTO[]> {
    const scheduleRows = await this.postgresClient
      .select(this.scheduleDTOColumnMap)
      .from('schedules as schedule')
      .join('organizations as organization', 'schedule.organization_id', 'organization.id')
      .join('screens as screen', 'schedule.screen_id', 'screen.id')
      .join('playlists as playlist', 'schedule.playlist_id', 'playlist.id')
      .where('schedule.organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, collectionOptions.where, this.scheduleDTOColumnMap))
      .orderBy(convertModelSortRulesToTableSortRules(collectionOptions.sort, this.scheduleDTOColumnMap));

    return scheduleRows.map((scheduleRow) => this.toScheduleDTO(scheduleRow));
  }

  async update(scheduleId: ScreenId, fieldsToUpdate: ScreenRepositoryUpdatableAttributes, trx?: Knex.Transaction): Promise<void> {
    const columns = convertFieldsToColumns(fieldsToUpdate, this.scheduleModelToTableColumnMap);

    if (Object.keys(columns).length === 0) {
      return;
    }

    await (trx || this.postgresClient)
      .update(columns)
      .from('schedules')
      .where('id', scheduleId);
  }

  async delete(scheduleId: ScreenId, trx?: Knex.Transaction): Promise<void> {
    await (trx || this.postgresClient)
      .delete()
      .from('schedules')
      .where('id', scheduleId);
  }

  public toScheduleDTO(scheduleRows: ScheduleModel): ScheduleDTO {
    const scheduleModel = {} as ScheduleModel;
    const organizationModel = {} as OrganizationModel;
    const screenModel = {} as ScreenModel;
    const playlistModel = {} as PlaylistModel;

    for (const [key, value] of Object.entries(scheduleRows)) {
      const [table, column] = key.split('.');

      if (table && !column) {
        // table is the column name
        scheduleModel[table] = value;
      } else if (table === 'organization') {
        organizationModel[column] = value;
      } else if (table === 'screen') {
        screenModel[column] = value;
      } else if (table === 'playlist') {
        playlistModel[column] = value;
      }
    }

    return {
      ...scheduleModel,
      organization: organizationModel,
      screen: screenModel,
      playlist: playlistModel,
    };
  }
}


export default new SchedulesRepository(postgresClient.getClient());
