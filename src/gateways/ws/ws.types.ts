import { WebSocket } from 'ws';

export interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
  clientType?: string
}

export interface SendMessageFuncParams{
  connection: ExtendedWebSocket;
  event: string;
  data: object | null;
}

export interface SendErrorFuncParams {
  connection: ExtendedWebSocket;
  errorType: string;
  message: string;
}

export type HandlersMapper = Record<string, Record<string, (connection: ExtendedWebSocket, data: object | null) => void>>
