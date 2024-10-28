import { ScreenId } from '../../../screens/service/screens.types';
import connectionsManager from '../../../screens/transport/ws/connections-manager';
import screensRepository from '../../../screens/service/screens.repository';
import logger from '../../../../modules/logger';
import { sendSchedule } from '../../../screens/transport/ws/screens.ws.event-senders';
import schedulesBuilder from '../../service/schedules.builder';
import schedulesRepository from '../../service/schedules.repository';

export const sendNewScheduleToScreen = async (screenId: ScreenId) => {
  const screen = await screensRepository.getModelById(screenId);

  if (!screen) {
    logger.warn(`screen with id="${screenId}" not found`, { tag: `WS_TRANSPORT | SCHEDULES | CLIENT:${screenId}` });
    return;
  }

  if (!screen.deviceId) {
    logger.warn(`screen with id="${screenId}" has no device linked`, { tag: `WS_TRANSPORT | SCHEDULES | CLIENT:${screenId}` });
    return;
  }

  const connection = connectionsManager.authorizedConnections.get(screen.deviceId);

  if (!connection) {
    logger.warn(`no connected device for screen with id="${screenId}"`, { tag: `WS_TRANSPORT | SCHEDULES | CLIENT:${screenId}` });
    return;
  }

  const schedule = await schedulesBuilder.buildNew(screen.id);

  await sendSchedule(connection, screen.deviceId, { schedule });
};

export const sendNewScheduleToScreensWithPlaylist = async (playlistId: string) => {
  const schedules = await schedulesRepository.getAllModelsWithPlaylistId(playlistId);

  for (const schedule of schedules) {
    await sendNewScheduleToScreen(schedule.screenId);
  }
};
