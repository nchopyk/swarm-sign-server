import logger from '../../../../../modules/logger';
import { ExtendedWebSocketConnection, IConnectionManager } from '../screens.ws.types';


class UnauthorizedConnectionsManager implements IConnectionManager {
  private readonly connections: Record<string, ExtendedWebSocketConnection> = {};

  public save(authCode: string, connection: ExtendedWebSocketConnection): void {
    logger.info(`saving unregistered connection with authCode=${authCode}`, { tag: 'WS GATEWAY | SCREENS | CONNECTION MANAGER' });

    const existingConnection = this.get(authCode);

    if (existingConnection) {
     throw new Error(`duplicate connection for transmitter with authCode=${authCode} detected, closing the previous one`);
    }

    connection['authCode'] = authCode;
    this.connections[authCode] = connection;
  }

  public get(authCode: string): ExtendedWebSocketConnection | null {
    return this.connections[authCode] || null;
  }

  public delete(authCode: string, connection: ExtendedWebSocketConnection): void {

    if (!this.connections[authCode]) {
      return;
    }

    if (this.connections[authCode] !== connection) {
      logger.warn(`attempt to delete unregistered connection with code=${authCode} that is not the same as the one stored in the manager`, {
        tag: 'WS GATEWAY | SCREENS | CONNECTION MANAGER'
      });

      return;
    }

    logger.info(`deleting unregistered connection with code=${authCode}`, { tag: 'WS GATEWAY | SCREENS | CONNECTION MANAGER' });
    delete this.connections[authCode];
  }

  public disconnect(clientId: string) {
    const connection = this.connections[clientId];

    if (!connection) {
      return;
    }

    logger.info(`terminating connection with client with id=${clientId}`, { tag: 'WS GATEWAY | SCREENS | CONNECTION MANAGER' });

    connection.close();
  }
}


export default UnauthorizedConnectionsManager;
