import initHttpGateway from './gateways/http/http.gateway';
import initWebSocketGateway from './gateways/ws/ws.gateway';
import { connectAllExternalServices } from './server-internals/utils';
import { collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics();
async function start() {
  await connectAllExternalServices();
  const httpGateway = await initHttpGateway();
  await initWebSocketGateway(httpGateway.server);
}

start();
