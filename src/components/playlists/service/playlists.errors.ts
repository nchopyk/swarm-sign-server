import { ApiError } from '../../../errors/error.types';
import { PlaylistCreationAttributes, PlaylistId } from './playlists.types';

const playlistsErrors = {
  notCreated: (context: { playlistData: PlaylistCreationAttributes }): ApiError => ({
    errorType: 'playlists.notCreated',
    message: 'Screen was not created',
    context
  }),

  withSuchIdNotFound: (context: { playlistId: PlaylistId }): ApiError => ({
    errorType: 'playlists.withSuchIdNotFound',
    message: `Screen with id=${context.playlistId} not found`,
    context
  }),
};

export default playlistsErrors;
