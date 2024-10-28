import logger from '../../../../modules/logger';
import connectionsManager from './connections-manager/index';
import screensRepository from '../../service/screens.repository';
import { sendAuthCode, sendLoginFailed, sendLoginSuccess, sendSchedule } from './screens.ws.event-senders';
import schedulesBuilder from '../../../schedules/service/schedules.builder';
import { ErrorEventPayload, EventHandler } from './screens.ws.types';
import { ScreenId } from '../../service/screens.types';


const screenEventsHandlers: Record<string, EventHandler> = {
  onError: async (connection, clientId, event, data) => {
    const payload = data as ErrorEventPayload;

    logger.warn(`error event received: ${payload.message}`, { tag: `WS_TRANSPORT | SCREENS | CLIENT:${clientId}` });
  },

  onNewScreen: async (connection, clientId, event, data) => {
    const authCode = Math.floor(1000 + Math.random() * 9000).toString(); // random 4-digit auth code

    connectionsManager.unauthorizedConnections.save(authCode, connection);
    connection['clientId'] = clientId;

    await sendAuthCode(connection, clientId, { code: authCode });
  },

  onLogin: async (connection, clientId, event, data) => {
    if (connection.authCode) {
      connectionsManager.unauthorizedConnections.delete(connection.authCode, connection);
    }

    const { screenId } = data as { screenId: ScreenId };

    const screen = await screensRepository.getModelById(screenId);

    if (!screen) {
      logger.warn(`screen with id="${clientId}" not found`, { tag: `WS_TRANSPORT | SCREENS | CLIENT:${clientId}` });
      await sendLoginFailed(connection, clientId);
      return;
    }

    if (screen.deviceId !== clientId) {
      logger.warn(`screen with deviceId="${clientId}" not found`, { tag: `WS_TRANSPORT | SCREENS | CLIENT:${clientId}` });
      await sendLoginFailed(connection, clientId);
      return;
    }

    connectionsManager.authorizedConnections.save(clientId, connection);
    await sendLoginSuccess(connection, clientId);

    const schedule = await schedulesBuilder.buildNew(screen.id);
    await sendSchedule(connection, clientId, { schedule });

    logger.info(`client ${clientId} logged in`, { tag: `WS_TRANSPORT | SCREENS | CLIENT:${clientId}` });
  }
};

export default screenEventsHandlers;
