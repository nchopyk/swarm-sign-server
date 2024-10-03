import { ScreenId } from '../../../screens/service/screens.types';
import connectionsManager from '../../../screens/transport/ws/connections-manager';
import screensRepository from '../../../screens/service/screens.repository';
import logger from '../../../../modules/logger';
import { sendSchedule } from '../../../screens/transport/ws/screens.ws.event-senders';
import schedulesBuilder from '../../service/schedules.builder';

export const sendNewScheduleToScreen = async (screenId: ScreenId) => {
  const screen = await screensRepository.getModelByDeviceId(screenId);

  if (!screen) {
    logger.warn(`screen with clientId ${screenId} not found`, { tag: `WS_TRANSPORT | SCHEDULES | CLIENT:${screenId}` });
    return;
  }

  if (!screen.deviceId) {
    logger.warn(`screen with clientId ${screenId} has no deviceId`, { tag: `WS_TRANSPORT | SCHEDULES | CLIENT:${screenId}` });
    return;
  }

  const connection = connectionsManager.authorizedConnections.get(screen.deviceId);

  if (!connection) {
    logger.warn(`screen with clientId ${screenId} not connected`, { tag: `WS_TRANSPORT | SCHEDULES | CLIENT:${screenId}` });
    return;
  }

  const schedule = await schedulesBuilder.buildNew(screen.id);

  await sendSchedule(connection, screen.deviceId, { schedule });
};
