import { ApiError } from '../../../errors/error.types';
import { PlaylistId, PlaylistMediaId } from './playlists.types';

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

  playlistMediasNotFound: (context: { playlistMediaIds: PlaylistMediaId[] }): ApiError => ({
    errorType: 'playlists.playlistMediasNotFound',
    message: `Playlist medias with ids=${context.playlistMediaIds.join(', ')} not found`,
    context
  }),

  playlistIsUsedInSchedule: (context: { playlistId: PlaylistId }): ApiError => ({
    errorType: 'playlists.playlistIsUsedInSchedule',
    message: `Playlist with id=${context.playlistId} is used in schedule`,
    context
  }),
};

export default playlistsErrors;
