import Errors from '../../../errors';
import mediasErrors from './medias.errors';
import organizationsRepository from '../../organizations/service/organizations.repository';
import organizationsErrors from '../../organizations/service/organizations.errors';
import mediasRepository from './medias.repository';
import { calculatePagination, resolveSkipAndLimitFromPagination } from '../../../modules/collection-query-processor/pagination/pagination.resolver';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { Collection, CollectionOptions } from '../../general/general.types';
import { GetMediaByIdFuncParams, MediaCreationAttributes, MediaDTO, MediaId, UpdateByIdForOrganizationFuncParams } from './medias.types';


class MediasService {
  public async create(newMediaData: MediaCreationAttributes) {
    const organization = await organizationsRepository.getModelById(newMediaData.organizationId);

    if (!organization) {
      throw new Errors.BadRequest(organizationsErrors.withSuchIdNotFound({ organizationId: newMediaData.organizationId }));
    }

    const newMediaId = await mediasRepository.create(newMediaData);

    const newMedia = await mediasRepository.getModelById(newMediaId);

    if (!newMedia) {
      throw new Errors.InternalError(mediasErrors.notCreated({ mediaData: newMediaData }));
    }

    return newMedia;
  }

  public async getAllForOrganization(organizationId: OrganizationId, collectionOptions: CollectionOptions): Promise<Collection<MediaDTO>> {
    const [organization, total] = await Promise.all([
      organizationsRepository.getModelById(organizationId),
      mediasRepository.getDTOsCollectionTotalCountForOrganization(organizationId, collectionOptions.where),
    ]);

    if (!organization) {
      throw new Errors.NotFoundError(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    const { sort, page, where } = collectionOptions;
    const pagination = calculatePagination(page.number, page.size, total);
    const { skip, limit } = resolveSkipAndLimitFromPagination(pagination);

    const medias = await mediasRepository.getDTOsCollectionForOrganization(organizationId, { sort, skip, limit, where });

    return {
      data: medias,
      meta: pagination,
    };
  }

  public async getByIdForOrganization({ organizationId, mediaId }: GetMediaByIdFuncParams): Promise<MediaDTO> {
    const media = await mediasRepository.getDTOByIdForOrganization({ organizationId, mediaId });

    if (!media) {
      throw new Errors.NotFoundError(mediasErrors.withSuchIdNotFound({ mediaId }));
    }

    return media;
  }

  public async updateByIdForOrganization({ organizationId, mediaId, fieldsToUpdate }: UpdateByIdForOrganizationFuncParams) {
    const media = await mediasRepository.getModelByIdForOrganization({ mediaId, organizationId });

    if (!media) {
      throw new Errors.NotFoundError(mediasErrors.withSuchIdNotFound({ mediaId }));
    }

    await mediasRepository.update(mediaId, fieldsToUpdate);

    const updatedMedia = await mediasRepository.getModelById(mediaId);

    if (!updatedMedia) {
      throw new Errors.InternalError(mediasErrors.withSuchIdNotFound({ mediaId }));
    }

    return updatedMedia;
  }

  public async deleteByIdForOrganization({ organizationId, mediaId }: { organizationId: OrganizationId, mediaId: MediaId }) {
    const media = await mediasRepository.getModelByIdForOrganization({ mediaId, organizationId });

    if (!media) {
      throw new Errors.NotFoundError(mediasErrors.withSuchIdNotFound({ mediaId }));
    }

    await mediasRepository.delete(mediaId);
  }
}


export default new MediasService();
