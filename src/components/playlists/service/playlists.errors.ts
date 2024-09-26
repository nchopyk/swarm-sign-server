import { ApiError } from '../../../errors/error.types';
import { PlaylistId } from './playlists.types';

const playlistsErrors = {
  withSuchIdNotFound: (context: { playlistId: PlaylistId }): ApiError => ({
    errorType: 'playlists.withSuchIdNotFound',
    message: `Screen with id=${context.playlistId} not found`,
    context
  }),

  mediasNotFound: (context: { mediaIds: string[] }): ApiError => ({
    errorType: 'playlists.mediasNotFound',
    message: `Medias with ids=${context.mediaIds.join(', ')} not found`,
    context
  }),
};

export default playlistsErrors;
