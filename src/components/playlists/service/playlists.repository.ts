import postgresClient from '../../../modules/postgres-db';
import organizationsRepository from '../../organizations/service/organizations.repository';
import mediasRepository from '../../medias/service/medias.repository';
import crypto from 'node:crypto';
import { Knex } from 'knex';
import { addTablePrefixToColumns, convertFieldsToColumns } from '../../general/utils/general.repository.utils';
import { convertModelSortRulesToTableSortRules } from '../../../modules/collection-query-processor/sort/sort.rules-converters';
import { convertFiltersToQueryCondition } from '../../../modules/collection-query-processor/filter/filter.knex-condition-builder';
import { MediaModel } from '../../medias/service/medias.types';
import { OrganizationId, OrganizationModel } from '../../organizations/service/organizations.types';
import { CollectionOptions, CollectionWhere, ModelToColumnsMapping, ModelToPrefixedColumnsMapping } from '../../general/general.types';
import {
  PlaylistModel,
  PlaylistRepositoryCreationAttributes,
  PlaylistId,
  PlaylistDTO,
  PlaylistRepositoryUpdatableAttributes,
  GetDTOByIdForOrganizationFuncParams,
  GetModelByIdForOrganizationFuncParams, PlaylistMediaModel, PlaylistMediaRepositoryCreationAttributes, PlaylistMediaDTO, PlaylistMediaId
} from './playlists.types';


export class PlaylistsRepository {
  public readonly playlistModelToTableColumnMap: ModelToColumnsMapping<PlaylistModel> = {
    id: 'id',
    organizationId: 'organization_id',
    name: 'name',
    notes: 'notes',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  public readonly playlistMediaModelToTableColumnMap: ModelToColumnsMapping<PlaylistMediaModel> = {
    id: 'id',
    playlistId: 'playlist_id',
    mediaId: 'media_id',
    duration: 'duration',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  public readonly playlistModelToPrefixedColumnsColumnMap = addTablePrefixToColumns(this.playlistModelToTableColumnMap, 'playlist');
  public readonly playlistModelToPrefixedColumnsColumnMapWithAliases = addTablePrefixToColumns(this.playlistModelToTableColumnMap, 'playlist', {
    includePrefixInAliases: true,
  });

  public readonly playlistMediaModelToPrefixedColumnsColumnMap = addTablePrefixToColumns(this.playlistMediaModelToTableColumnMap, 'playlistMedia');

  public readonly playlistDTOColumnMap: ModelToPrefixedColumnsMapping = {
    ...this.playlistModelToPrefixedColumnsColumnMap,
    ...organizationsRepository.organizationsModelToPrefixedColumnsMapWithAliases,
  };

  public readonly playlistMediaDTOColumnMap: ModelToPrefixedColumnsMapping = {
    ...this.playlistMediaModelToPrefixedColumnsColumnMap,
    ...mediasRepository.mediaModelToPrefixedColumnsColumnMapWithAliases,
  };

  constructor(private postgresClient: Knex) {
    this.postgresClient = postgresClient;
  }

  async create(newPlaylistData: PlaylistRepositoryCreationAttributes, trx?: Knex.Transaction): Promise<PlaylistId> {
    const id = crypto.randomUUID();
    const columns = convertFieldsToColumns({ ...newPlaylistData, id }, this.playlistModelToTableColumnMap);

    await (trx || this.postgresClient)
      .insert(columns)
      .into('playlists');

    return id;
  }

  async createPlaylistMedia(newPlaylistMediaData: PlaylistMediaRepositoryCreationAttributes, trx?: Knex.Transaction): Promise<void> {
    const id = crypto.randomUUID();

    const columns = convertFieldsToColumns({
      ...newPlaylistMediaData,
      id,
    }, this.playlistMediaModelToTableColumnMap);


    await (trx || this.postgresClient)
      .insert(columns)
      .into('playlists_medias');
  }

  async getModelById(id: PlaylistId, trx?: Knex.Transaction): Promise<PlaylistModel | null> {
    return (trx || this.postgresClient)
      .select(this.playlistModelToTableColumnMap)
      .from('playlists')
      .where('id', id)
      .first();
  }

  async getModelByIdForOrganization({ playlistId, organizationId }: GetModelByIdForOrganizationFuncParams, trx?: Knex.Transaction): Promise<PlaylistModel | null> {
    return (trx || this.postgresClient)
      .select(this.playlistModelToTableColumnMap)
      .from('playlists')
      .where('id', playlistId)
      .andWhere('organization_id', organizationId)
      .first();
  }

  async getDTOByIdForOrganization({ playlistId, organizationId }: GetDTOByIdForOrganizationFuncParams, trx?: Knex.Transaction): Promise<PlaylistDTO | null> {
    const playlistRows = await (trx || this.postgresClient)
      .select(this.playlistDTOColumnMap)
      .from('playlists as playlist')
      .join('organizations as organization', 'playlist.organization_id', 'organization.id')
      .where('playlist.id', playlistId)
      .andWhere('playlist.organization_id', organizationId)
      .first();


    return playlistRows ? this.toPlaylistDTO(playlistRows) : null;
  }

  async getDTOsCollectionForOrganization(organizationId: OrganizationId, collectionOptions: CollectionOptions): Promise<PlaylistDTO[]> {
    const playlistRows = await this.postgresClient
      .select(this.playlistDTOColumnMap)
      .from('playlists as playlist')
      .join('organizations as organization', 'playlist.organization_id', 'organization.id')
      .where('playlist.organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, collectionOptions.where, this.playlistDTOColumnMap))
      .orderBy(convertModelSortRulesToTableSortRules(collectionOptions.sort, this.playlistDTOColumnMap));

    return playlistRows.map((playlistRow) => this.toPlaylistDTO(playlistRow));
  }

  async getDTOsCollectionTotalCountForOrganization(organizationId: OrganizationId, filters: CollectionWhere): Promise<number> {
    const result: { count: string } = await this.postgresClient
      .count('playlist.id')
      .from('playlists as playlist')
      .join('organizations as organization', 'playlist.organization_id', 'organization.id')
      .where('playlist.organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, filters, this.playlistDTOColumnMap))
      .first();

    return parseInt(result.count, 10);
  }

  async getAllPlaylistMediasDTOs(playlistId: PlaylistId): Promise<PlaylistMediaDTO[]> {
    const rows = await this.postgresClient
      .select(this.playlistMediaDTOColumnMap)
      .from('playlists_medias as playlistMedia')
      .join('medias as media', 'playlistMedia.media_id', 'media.id')
      .where('playlistMedia.playlist_id', playlistId);

    return rows.map((row) => this.toPlaylistMediaDTO(row));
  }

  async getAllPlaylistsMediasModelsByMediaId(mediaId: string): Promise<PlaylistMediaModel[]> {
    return this.postgresClient
      .select(this.playlistMediaModelToTableColumnMap)
      .from('playlists_medias')
      .where('media_id', mediaId);
  }

  async update(playlistId: PlaylistId, fieldsToUpdate: PlaylistRepositoryUpdatableAttributes, trx?: Knex.Transaction): Promise<void> {
    const columns = convertFieldsToColumns(fieldsToUpdate, this.playlistModelToTableColumnMap);

    if (Object.keys(columns).length === 0) {
      return;
    }

    await (trx || this.postgresClient)
      .update(columns)
      .from('playlists')
      .where('id', playlistId);
  }

  async delete(playlistId: PlaylistId, trx?: Knex.Transaction): Promise<void> {
    await (trx || this.postgresClient)
      .delete()
      .from('playlists')
      .where('id', playlistId);
  }

  async getPlaylistMediasModelsByIds(playlistMediaIds: PlaylistMediaId[]): Promise<PlaylistMediaModel[]> {
    return this.postgresClient
      .select(this.playlistMediaModelToTableColumnMap)
      .from('playlists_medias')
      .whereIn('id', playlistMediaIds);
  }

  async deletePlaylistMedia(playlistMediaId: PlaylistMediaId, trx?: Knex.Transaction): Promise<void> {
    await (trx || this.postgresClient)
      .delete()
      .from('playlists_medias')
      .where('id', playlistMediaId);
  }

  public toPlaylistDTO(playlistRows: PlaylistModel): PlaylistDTO {
    const playlistModel = {} as PlaylistModel;
    const organizationModel = {} as OrganizationModel;

    for (const [key, value] of Object.entries(playlistRows)) {
      const [table, column] = key.split('.');

      if (table && !column) {
        // table is the column name
        playlistModel[table] = value;
      } else if (table === 'organization') {
        organizationModel[column] = value;
      }
    }

    return {
      ...playlistModel,
      organization: organizationModel,
    };
  }

  public toPlaylistMediaDTO(playlistRows: PlaylistModel): PlaylistMediaDTO {
    const playlistMediaModel = {} as PlaylistMediaModel;
    const mediaModel = {} as MediaModel;

    for (const [key, value] of Object.entries(playlistRows)) {
      const [table, column] = key.split('.');

      if (table && !column) {
        // table is the column name
        playlistMediaModel[table] = value;
      } else if (table === 'media') {
        mediaModel[column] = value;
      }
    }

    return {
      ...playlistMediaModel,
      media: mediaModel,
    };
  }
}


export default new PlaylistsRepository(postgresClient.getClient());
