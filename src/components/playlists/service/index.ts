import Errors from '../../../errors';
import playlistsErrors from './playlists.errors';
import organizationsRepository from '../../organizations/service/organizations.repository';
import organizationsErrors from '../../organizations/service/organizations.errors';
import playlistsRepository from './playlists.repository';
import mediasRepository from '../../medias/service/medias.repository';
import postgresDb from '../../../modules/postgres-db';
import { calculatePagination, resolveSkipAndLimitFromPagination } from '../../../modules/collection-query-processor/pagination/pagination.resolver';
import { DEFAULT_MEDIA_DURATION } from '../../medias/service/media.constants';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { Collection, CollectionOptions } from '../../general/general.types';
import {
  GetPlaylistByIdFuncParams,
  PlaylistServiceCreationAttributes,
  PlaylistDTO,
  PlaylistId,
  UpdateByIdForOrganizationFuncParams,
} from './playlists.types';
import { MediaId } from '../../medias/service/medias.types';


class PlaylistsService {
  public async create(newPlaylistData: PlaylistServiceCreationAttributes, medias: MediaId[]): Promise<PlaylistDTO> {
    const organization = await organizationsRepository.getModelById(newPlaylistData.organizationId);

    if (!organization) {
      throw new Errors.BadRequest(organizationsErrors.withSuchIdNotFound({ organizationId: newPlaylistData.organizationId }));
    }

    const mediasModels = await mediasRepository.getModelsByIds(medias);

    const foundMediaIds = mediasModels.map((media) => media.id);
    const notFoundMediaIds = medias.filter((mediaId) => !foundMediaIds.includes(mediaId));

    if (notFoundMediaIds.length) {
      throw new Errors.BadRequest(playlistsErrors.mediasNotFound({ mediaIds: notFoundMediaIds }));
    }

    const newPlaylistId = await postgresDb.getClient().transaction(async (trx) => {
      const newPlaylistId = await playlistsRepository.create(newPlaylistData, trx);

      for (const mediaModel of mediasModels) {
        await playlistsRepository.createPlaylistMedia({
          playlistId: newPlaylistId,
          mediaId: mediaModel.id,
          duration: mediaModel.duration || DEFAULT_MEDIA_DURATION,
        }, trx);
      }

      return newPlaylistId;
    });

    const newPlaylist = await this.getByIdForOrganization({ organizationId: newPlaylistData.organizationId, playlistId: newPlaylistId });

    return newPlaylist;
  }

  public async getAllForOrganization(organizationId: OrganizationId, collectionOptions: CollectionOptions): Promise<Collection<PlaylistDTO>> {
    const [organization, total] = await Promise.all([
      organizationsRepository.getModelById(organizationId),
      playlistsRepository.getDTOsCollectionTotalCountForOrganization(organizationId, collectionOptions.where),
    ]);

    if (!organization) {
      throw new Errors.NotFoundError(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    const { sort, page, where } = collectionOptions;
    const pagination = calculatePagination(page.number, page.size, total);
    const { skip, limit } = resolveSkipAndLimitFromPagination(pagination);

    const playlists = await playlistsRepository.getDTOsCollectionForOrganization(organizationId, { sort, skip, limit, where });

    return {
      data: playlists,
      meta: pagination,
    };
  }

  public async getByIdForOrganization({ organizationId, playlistId }: GetPlaylistByIdFuncParams): Promise<PlaylistDTO> {
    const playlist = await playlistsRepository.getDTOByIdForOrganization({ organizationId, playlistId });

    if (!playlist) {
      throw new Errors.NotFoundError(playlistsErrors.withSuchIdNotFound({ playlistId }));
    }

    return playlist;
  }

  public async updateByIdForOrganization({ organizationId, playlistId, fieldsToUpdate }: UpdateByIdForOrganizationFuncParams) {
    const playlist = await playlistsRepository.getModelByIdForOrganization({ playlistId, organizationId });

    if (!playlist) {
      throw new Errors.NotFoundError(playlistsErrors.withSuchIdNotFound({ playlistId }));
    }

    await playlistsRepository.update(playlistId, fieldsToUpdate);

    const updatedPlaylist = await playlistsRepository.getModelById(playlistId);

    if (!updatedPlaylist) {
      throw new Errors.InternalError(playlistsErrors.withSuchIdNotFound({ playlistId }));
    }

    return updatedPlaylist;
  }

  public async deleteByIdForOrganization({ organizationId, playlistId }: { organizationId: OrganizationId, playlistId: PlaylistId }) {
    const playlist = await playlistsRepository.getModelByIdForOrganization({ playlistId, organizationId });

    if (!playlist) {
      throw new Errors.NotFoundError(playlistsErrors.withSuchIdNotFound({ playlistId }));
    }

    await playlistsRepository.delete(playlistId);
  }
}


export default new PlaylistsService();
