import fs from 'fs';
import path from 'path';
import Errors from '../../../errors';
import mediasErrors from './medias.errors';
import organizationsRepository from '../../organizations/service/organizations.repository';
import organizationsErrors from '../../organizations/service/organizations.errors';
import mediasRepository from './medias.repository';
import { convertContentKeyToUrl, getImageProperties, getVideoProperties } from './medias.utils';
import { MEDIA_TYPES } from './media.constants';
import { STATIC_FOLDER_PATH } from '../../../config';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { Collection, CollectionOptions } from '../../general/general.types';
import {
  GetMediaByIdFuncParams,
  MediaContent,
  MediaDTO,
  MediaId,
  MediaServiceCreationAttributes,
  UpdateByIdForOrganizationFuncParams
} from './medias.types';


class MediasService {
  public async create(organizationId: OrganizationId, newMediaData: MediaServiceCreationAttributes) {
    const { name, notes, type, mediaFile, buffer } = newMediaData;

    const organization = await organizationsRepository.getModelById(organizationId);

    if (!organization) {
      throw new Errors.BadRequest(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    const fileKey = await this.saveFile(organizationId, mediaFile.filename, buffer);

    const mediaProperties = type === MEDIA_TYPES.VIDEO ? await getVideoProperties(path.join(STATIC_FOLDER_PATH, fileKey)) : await getImageProperties(buffer);

    const newMediaId = await mediasRepository.create({
      organizationId,
      name,
      notes,
      type,
      content: fileKey,
      duration: mediaProperties.duration,
      width: mediaProperties.width,
      height: mediaProperties.height,
      mimeType: mediaFile.mimetype,
      size: mediaFile.size
    });

    return await this.getByIdForOrganization({ organizationId, mediaId: newMediaId });
  }

  public async getAllForOrganization(organizationId: OrganizationId, collectionOptions: CollectionOptions): Promise<Collection<MediaDTO>> {
    const organization = await organizationsRepository.getModelById(organizationId);


    if (!organization) {
      throw new Errors.NotFoundError(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    const medias = await mediasRepository.getDTOsCollectionForOrganization(organizationId, collectionOptions);

    return {
      data: medias.map((media) => ({ ...media, content: convertContentKeyToUrl(media.content) })),
    };
  }

  public async getByIdForOrganization({ organizationId, mediaId }: GetMediaByIdFuncParams): Promise<MediaDTO> {
    const media = await mediasRepository.getDTOByIdForOrganization({ organizationId, mediaId });

    if (!media) {
      throw new Errors.NotFoundError(mediasErrors.withSuchIdNotFound({ mediaId }));
    }

    return {
      ...media,
      content: convertContentKeyToUrl(media.content),
    };
  }

  public async updateByIdForOrganization({ organizationId, mediaId, fieldsToUpdate, buffer }: UpdateByIdForOrganizationFuncParams) {
    const media = await mediasRepository.getModelByIdForOrganization({ mediaId, organizationId });

    if (!media) {
      throw new Errors.NotFoundError(mediasErrors.withSuchIdNotFound({ mediaId }));
    }

    if (fieldsToUpdate.mediaFile && buffer) {
      const fileKey = await this.saveFile(organizationId, fieldsToUpdate.mediaFile.filename, buffer);

      const mediaProperties = media.type === MEDIA_TYPES.VIDEO ?
        await getVideoProperties(path.join(STATIC_FOLDER_PATH, fileKey)) :
        await getImageProperties(buffer);

      fieldsToUpdate['content'] = fileKey;
      fieldsToUpdate['duration'] = mediaProperties.duration;
      fieldsToUpdate['width'] = mediaProperties.width;
      fieldsToUpdate['height'] = mediaProperties.height;
      fieldsToUpdate['mimeType'] = fieldsToUpdate.mediaFile.mimetype;
      fieldsToUpdate['size'] = fieldsToUpdate.mediaFile.size;

      delete fieldsToUpdate.mediaFile;
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

  private async saveFile(organizationId: OrganizationId, filename: string, buffer: Buffer): Promise<MediaContent> {
    await this.createStaticFolderIfNotExists();

    const extension = path.extname(filename);
    const fileKey = `${organizationId}-${Date.now()}${extension}`;
    const filePath = path.join(STATIC_FOLDER_PATH, fileKey);

    await fs.promises.writeFile(filePath, buffer);

    return fileKey;
  }


  private async createStaticFolderIfNotExists() {
    const staticFolderPath = path.join(STATIC_FOLDER_PATH);

    const folderExists = await fs.promises.access(staticFolderPath, fs.constants.F_OK).then(() => true).catch(() => false);

    if (!folderExists) {
      await fs.promises.mkdir(staticFolderPath);
    }
  }
}


export default new MediasService();
