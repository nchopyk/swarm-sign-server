import mediaService from '../../../service';
import { MediaCreationAttributes, MediaServiceUpdatableAttributes } from '../../../service/medias.types';
import { CollectionOptions } from '../../../../general/general.types';


export class MediasController {
  create = async (req, res) => {
    const { organizationId } = req.params;
    const { name, notes, content, type, duration, mimeType, size } = req.body;

    const newVehicleData: MediaCreationAttributes = {
      organizationId,
      name,
      notes,
      content,
      type,
      duration,
      mimeType,
      size,
    };

    const media = await mediaService.create(newVehicleData);

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
    const { name, notes, content, type, duration, mimeType, size } = req.body;

    const fieldsToUpdate: MediaServiceUpdatableAttributes = { name, notes, content, type, duration, mimeType, size };
    const updatedMedia = await mediaService.updateByIdForOrganization({ organizationId, mediaId, fieldsToUpdate });

    return res.status(200).send(updatedMedia);
  };

  deleteByIdForOrganization = async (req, res) => {
    const { organizationId, mediaId } = req.params;

    await mediaService.deleteByIdForOrganization({ organizationId, mediaId });

    return res.status(200).send({ message: 'Media deleted successfully.' });
  };
}

export default new MediasController();
