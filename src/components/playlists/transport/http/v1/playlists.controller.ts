import playlistService from '../../../service';
import { PlaylistServiceCreationAttributes, PlaylistServiceUpdatableAttributes } from '../../../service/playlists.types';
import { CollectionOptions } from '../../../../general/general.types';


export class PlaylistsController {
  create = async (req, res) => {
    const { organizationId } = req.params;
    const { name, notes, medias } = req.body;

    const newPlaylistData: PlaylistServiceCreationAttributes = { organizationId, name, notes };
    const playlist = await playlistService.create(newPlaylistData, medias);

    return res.status(200).send(playlist);
  };

  getAllForOrganization = async (req, res) => {
    const { organizationId } = req.params;
    const { sort, where } = req.query;

    const collectionOptions: CollectionOptions = { sort, where };
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

  getPlaylistMedias = async (req, res) => {
    const { organizationId, playlistId } = req.params;

    const medias = await playlistService.getPlaylistMedias({ organizationId, playlistId });

    return res.status(200).send(medias);
  };

  addPlaylistMedias = async (req, res) => {
    const { organizationId, playlistId } = req.params;
    const { medias } = req.body;

    const updatedPlaylist = await playlistService.addPlaylistMedias({ organizationId, playlistId, medias });

    return res.status(200).send(updatedPlaylist);
  };

  removePlaylistMedias = async (req, res) => {
    const { organizationId, playlistId } = req.params;
    const { playlistMedias } = req.body;

    const updatedPlaylist = await playlistService.removePlaylistMedias({ organizationId, playlistId, playlistMedias });

    return res.status(200).send(updatedPlaylist);
  };
}

export default new PlaylistsController();
