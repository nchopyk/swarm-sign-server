import { SCREEN_EVENTS, SERVER_EVENTS } from './screens.ws.constants';
import { EventHandler, ExtendedWebSocketConnection } from './screens.ws.types';
import eventHandlers from './screens.ws.event-handlers';
import { sendEvent } from '../../../../gateways/ws/ws.internal-utils';
import ERROR_TYPES from '../../../../constants/errors-types';
import logger from '../../../../modules/logger';
import connectionsManager from './connections-manager/index';

class ScreensWsTransport {
  private readonly handlersMap: Record<string, EventHandler>;

  constructor() {
    this.handlersMap = {
      [SCREEN_EVENTS.ERROR]: eventHandlers.onError,
      [SCREEN_EVENTS.NEW_SCREEN]: eventHandlers.onNewScreen,
      [SCREEN_EVENTS.LOGIN]: eventHandlers.onLogin,
    };
  }

  public async onData(connection: ExtendedWebSocketConnection, clientId: string, event: string, data: object) {
    try {
      logger.info(`received event: ${event}, data: ${JSON.stringify(data)}`, { tag: `WS GATEWAY | SCREENS | CLIENT:${clientId}` });

      const handler = this.handlersMap[event];

      if (!handler) {
        return sendEvent({
          connection, clientId,
          event: SERVER_EVENTS.ERROR,
          data: {
            errorType: ERROR_TYPES.UNKNOWN_EVENT,
            message: `No handler for "${event}" event`
          }
        });
      }

      await handler(connection, clientId, event, data);
    } catch (error) {
      logger.error(<Error>error, { tag: 'WS GATEWAY | SCREENS' });
    }
  }

  public async onValidationError(connection: ExtendedWebSocketConnection, clientId: string | null, error: Error) {
    logger.warn(`validation error: ${error.message}`, { tag: 'WS GATEWAY | SCREENS' });
    return sendEvent({
      connection,
      clientId,
      event: SERVER_EVENTS.ERROR,
      data: {
        errorType: ERROR_TYPES.INVALID_DATA_FORMAT,
        message: error.message
      }
    });
  }


  public async onConnection(connection: ExtendedWebSocketConnection) {
    logger.info('new connection established', { tag: 'WS GATEWAY | SCREENS' });
  }


  public async onClose(connection: ExtendedWebSocketConnection) {
    logger.info('connection closed', { tag: 'WS GATEWAY | SCREENS' });

    if (connection.clientId) {
      connectionsManager.authorizedConnections.delete(connection.clientId, connection);
    }

    if (connection.authCode) {
      connectionsManager.unauthorizedConnections.delete(connection.authCode, connection);
    }
  }
}


export default new ScreensWsTransport();
