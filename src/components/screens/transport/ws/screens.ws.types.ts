import { WebSocket } from 'ws';


export type EventHandler = (connection: ExtendedWebSocketConnection, clientId: string, event: string, data: object) => Promise<void>

export interface ExtendedWebSocketConnection extends WebSocket {
  clientId?: string;
  authCode?: string;
}

export interface IConnectionManager {
  save(clientId: string, connection: WebSocket): void;

  get(clientId: string): WebSocket | null;

  delete(clientId: string, connection: WebSocket): void;

  disconnect(clientId: string): void;
}


export interface ErrorEventPayload {
  message: string;
  messageType: string;
}
