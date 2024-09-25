import Errors from '../../../errors';
import playlistsErrors from './playlists.errors';
import organizationsRepository from '../../organizations/service/organizations.repository';
import organizationsErrors from '../../organizations/service/organizations.errors';
import playlistsRepository from './playlists.repository';
import { calculatePagination, resolveSkipAndLimitFromPagination } from '../../../modules/collection-query-processor/pagination/pagination.resolver';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { Collection, CollectionOptions } from '../../general/general.types';
import { GetPlaylistByIdFuncParams, PlaylistCreationAttributes, PlaylistDTO, PlaylistId, UpdateByIdForOrganizationFuncParams } from './playlists.types';


class PlaylistsService {
  public async create(newPlaylistData: PlaylistCreationAttributes) {
    const organization = await organizationsRepository.getModelById(newPlaylistData.organizationId);

    if (!organization) {
      throw new Errors.BadRequest(organizationsErrors.withSuchIdNotFound({ organizationId: newPlaylistData.organizationId }));
    }

    const newPlaylistId = await playlistsRepository.create(newPlaylistData);

    const newPlaylist = await playlistsRepository.getModelById(newPlaylistId);

    if (!newPlaylist) {
      throw new Errors.InternalError(playlistsErrors.notCreated({ playlistData: newPlaylistData }));
    }

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
