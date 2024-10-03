import { ErrorEventPayload, EventHandler } from './screens.ws.types';
import logger from '../../../../modules/logger';
import connectionsManager from './connections-manager/index';
import screensRepository from '../../service/screens.repository';
import { sendAuthCode, sendLoginFailed, sendLoginSuccess, sendSchedule } from './screens.ws.event-senders';
import schedulesBuilder from '../../../schedules/service/schedules.builder';


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

    const screen = await screensRepository.getModelByDeviceId(clientId);

    if (!screen) {
      logger.warn(`screen with clientId ${clientId} not found`, { tag: `WS_TRANSPORT | SCREENS | CLIENT:${clientId}` });
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
