import mediaService from '../../../service';
import { MediaServiceCreationAttributes, MediaServiceUpdatableAttributes } from '../../../service/medias.types';
import { CollectionOptions } from '../../../../general/general.types';


export class MediasController {
  create = async (req, res) => {
    const { organizationId } = req.params;

    const { name, notes, type, mediaFile } = req.body;
    const buffer = req.file;

    const newMediaData: MediaServiceCreationAttributes = { name, notes, type, mediaFile, buffer };

    const media = await mediaService.create(organizationId, newMediaData);

    return res.status(200).send(media);
  };

  getAllForOrganization = async (req, res) => {
    const { organizationId } = req.params;
    const { sort, page, where } = req.query;

    const collectionOptions: CollectionOptions = { sort, page, where };
    const collection = await mediaService.getAllForOrganization(organizationId, collectionOptions);

    return res.status(200).send(collection);
  };

  getByIdForOrganization = async (req, res) => {
    const { organizationId, mediaId } = req.params;

    const media = await mediaService.getByIdForOrganization({ organizationId, mediaId });

    return res.status(200).send(media);
  };

  updateByIdForOrganization = async (req, res) => {
    const { organizationId, mediaId } = req.params;
    const { name, notes, type, mediaFile } = req.body;
    const buffer = req.file;

    const fieldsToUpdate: MediaServiceUpdatableAttributes = { name, notes, type, mediaFile };
    const updatedMedia = await mediaService.updateByIdForOrganization({ organizationId, mediaId, fieldsToUpdate, buffer });

    return res.status(200).send(updatedMedia);
  };

  deleteByIdForOrganization = async (req, res) => {
    const { organizationId, mediaId } = req.params;

    await mediaService.deleteByIdForOrganization({ organizationId, mediaId });

    return res.status(200).send({ message: 'Media deleted successfully.' });
  };
}

export default new MediasController();
