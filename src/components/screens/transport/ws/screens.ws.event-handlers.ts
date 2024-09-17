import { ErrorEventPayload, EventHandler } from './screens.ws.types';
import logger from '../../../../modules/logger';
import connectionsManager from './connections-manager/index';
import { sendAuthCode, sendLoginSuccess } from './screens.ws.event-senders';


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

    connectionsManager.authorizedConnections.save(clientId, connection);
    await sendLoginSuccess(connection, clientId);

    logger.info(`client ${clientId} logged in`, { tag: `WS_TRANSPORT | SCREENS | CLIENT:${clientId}` });
  }
};

export default screenEventsHandlers;
