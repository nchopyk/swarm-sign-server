import { WebSocketServer } from 'ws';
import validationSchemas from './ws.validation-schemas';
import screensWsTransport from '../../components/screens/transport/ws/index';
import logger from '../../modules/logger';
import { heartbeat, initHealthCheckInterval, validate } from './ws.internal-utils';
import { Server } from 'http';
import { ExtendedWebSocket } from './ws.types';

async function initWebSocketGateway(httpServer: Server) {
  const wsServer = new WebSocketServer({ server: httpServer });

  wsServer.on('connection', async (ws: ExtendedWebSocket) => {
    ws.isAlive = true;

    await screensWsTransport.onConnection(ws);

    ws.on('message', async (msg) => {
      try {
        const parsedData = JSON.parse(msg.toString());

        const { error, value: payload } = validate({ schema: validationSchemas.incomingMessage, data: parsedData });

        if (error) {
          await screensWsTransport.onValidationError(ws, parsedData.clientId || null, error);
          return;
        }

        const { clientId, event, data } = payload;

        await screensWsTransport.onData(ws, clientId, event, data);
      } catch (error) {
        logger.error(<Error>error, { tag: 'WS GATEWAY' });
      }
    });

    ws.on('pong', () => heartbeat(ws));

    ws.on('error', async (err) => {
      await screensWsTransport.onClose(ws);
    });

    ws.on('close', async () => {
      await screensWsTransport.onClose(ws);
    });
  });

  const healthcheckInterval = initHealthCheckInterval(wsServer);

  wsServer.on('close', () => {
    clearInterval(healthcheckInterval);
  });
}

export default initWebSocketGateway;

