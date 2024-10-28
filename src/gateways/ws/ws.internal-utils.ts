import { WebSocketServer } from 'ws';
import { WS_CONNECTION_HEALTHCHECK_INTERVAL } from '../../config';
import { ExtendedWebSocket } from './ws.types';


export const heartbeat = (ws) => {
  ws.isAlive = true;
};

export const initHealthCheckInterval = (wss: WebSocketServer) => setInterval(() => {
  wss.clients.forEach((ws: ExtendedWebSocket): void => {
    if (!ws.isAlive) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
}, WS_CONNECTION_HEALTHCHECK_INTERVAL);

export const validate = ({ schema, data }) => {
  const { value, error } = schema.validate(data);

  return { error, value };
};

export const sendEvent = ({ connection, clientId, event, data }) => connection.send(JSON.stringify({ clientId, event, data }));

