import logger from '../../../../../modules/logger';
import { IConnectionManager } from '../screens.ws.types';
import { WebSocket } from 'ws';


class AuthorizedConnectionsManager implements IConnectionManager {
  private readonly connections: Record<string, WebSocket> = {};

  public save(clientId: string, connection: WebSocket): void {
    logger.info(`saving authorized connection for client with id=${clientId}`, { tag: 'WS GATEWAY | SCREENS | CONNECTION MANAGER' });

    const existingConnection = this.get(clientId);

    if (existingConnection) {
      logger.warn(`duplicate connection for client with id=${clientId} detected, closing the previous one`, {
        tag: 'WS GATEWAY | SCREENS | CONNECTION MANAGER'
      });

      this.disconnect(clientId);
    }

    connection['clientId'] = clientId;
    this.connections[clientId] = connection;
  }

  public get(clientId: string): WebSocket | null {
    return this.connections[clientId] || null;
  }

  public delete(clientId: string, connection: WebSocket): void {
    if (!this.connections[clientId]) {
      return;
    }

    if (this.connections[clientId] !== connection) {
      logger.warn(`attempt to delete authorized connection for client with id=${clientId} that is not the same as the one stored in the manager`, {
        tag: 'WS GATEWAY | SCREENS | CONNECTION MANAGER'
      });

      return;
    }

    logger.info(`deleting authorized connection for client with id=${clientId}`, { tag: 'WS GATEWAY | SCREENS | CONNECTION MANAGER' });

    delete this.connections[clientId];
  }

  public disconnect(clientId: string): void {
    const connection = this.connections[clientId];

    if (!connection) {
      return;
    }

    logger.info(`terminating connection with client with id=${clientId}`, { tag: 'WS GATEWAY | SCREENS | CONNECTION MANAGER' });

    connection.close();
  }
}


export default AuthorizedConnectionsManager;
