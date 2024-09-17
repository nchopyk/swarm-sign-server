import { ExtendedWebSocket } from '../../../../gateways/ws/ws.types';
import { sendEvent } from '../../../../gateways/ws/ws.internal-utils';
import { SERVER_EVENTS } from './screens.ws.constants';
import logger from '../../../../modules/logger';


export const sendAuthCode = async (connection: ExtendedWebSocket, clientId: string, data: { code: string }) => {
  logger.info(`sending ${SERVER_EVENTS.AUTH_CODE} event with code: ${data.code}`, { tag: `WS GATEWAY | SCREENS | CLIENT:${clientId}` });
  return sendEvent({ connection, clientId, event: SERVER_EVENTS.AUTH_CODE, data });
};


export const sendAuthSuccess = async (connection: ExtendedWebSocket, clientId: string, data: { screenId: string }) => {
  logger.info(`sending ${SERVER_EVENTS.AUTH_SUCCESS} event`, { tag: `WS GATEWAY | SCREENS | CLIENT:${clientId}` });
  return sendEvent({ connection, clientId, event: SERVER_EVENTS.AUTH_SUCCESS, data });
};

export const sendLoginSuccess = async (connection: ExtendedWebSocket, clientId: string) => {
  logger.info(`sending ${SERVER_EVENTS.LOGIN_SUCCESS} event`, { tag: `WS GATEWAY | SCREENS | CLIENT:${clientId}` });
  return sendEvent({ connection, clientId, event: SERVER_EVENTS.LOGIN_SUCCESS, data: null });
};
