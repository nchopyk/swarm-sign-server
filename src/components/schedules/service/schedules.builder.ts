import Errors from '../../../errors';
import playlistsErrors from '../../playlists/service/playlists.errors';
import schedulesRepository from './schedules.repository';
import playlistsRepository from '../../playlists/service/playlists.repository';
import playlistsService from '../../playlists/service';
import { ScreenId } from '../../screens/service/screens.types';


class SchedulesBuilder {
  async buildNew(screenId: ScreenId) {
    const schedule = await schedulesRepository.getModelByScreenId(screenId);

    if (!schedule) {
      return null;
    }

    const playlist = await playlistsRepository.getModelById(schedule.playlistId);
    const medias = await playlistsService.getPlaylistMedias(schedule.playlistId);

    if (!playlist) {
      throw new Errors.InternalError(playlistsErrors.withSuchIdNotFound({ playlistId: schedule.playlistId }));
    }

    return {
      schedule,
      playlist,
      medias,
    };
  }
}

export default new SchedulesBuilder();
