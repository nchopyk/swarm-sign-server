import playlistService from '../../../service';
import { PlaylistCreationAttributes, PlaylistServiceUpdatableAttributes } from '../../../service/playlists.types';
import { CollectionOptions } from '../../../../general/general.types';


export class PlaylistsController {
  create = async (req, res) => {
    const { organizationId } = req.params;
    const { name, notes } = req.body;

    const newVehicleData: PlaylistCreationAttributes = { organizationId, name, notes };
    const playlist = await playlistService.create(newVehicleData);

    return res.status(200).send(playlist);
  };

  getAllForOrganization = async (req, res) => {
    const { organizationId } = req.params;
    const { sort, page, where } = req.query;

    const collectionOptions: CollectionOptions = { sort, page, where };
    const collection = await playlistService.getAllForOrganization(organizationId, collectionOptions);

    return res.status(200).send(collection);
  };

  getByIdForOrganization = async (req, res) => {
    const { organizationId, playlistId } = req.params;

    const playlist = await playlistService.getByIdForOrganization({ organizationId, playlistId });

    return res.status(200).send(playlist);
  };

  updateByIdForOrganization = async (req, res) => {
    const { organizationId, playlistId } = req.params;
    const { name, notes } = req.body;

    const fieldsToUpdate: PlaylistServiceUpdatableAttributes = { name, notes };
    const updatedPlaylist = await playlistService.updateByIdForOrganization({ organizationId, playlistId, fieldsToUpdate });

    return res.status(200).send(updatedPlaylist);
  };

  deleteByIdForOrganization = async (req, res) => {
    const { organizationId, playlistId } = req.params;

    await playlistService.deleteByIdForOrganization({ organizationId, playlistId });

    return res.status(200).send({ message: 'Playlist deleted successfully.' });
  };
}

export default new PlaylistsController();
