import connectionsManager from '../transport/ws/connections-manager';
import Errors from '../../../errors';
import screensErrors  from './screens.errors';
import { sendAuthSuccess } from '../transport/ws/screens.ws.event-senders';


class ScreensService {
  async activate(code: string) {
    const connection = connectionsManager.unauthorizedConnections.get(code);

    if (!connection) {
      throw new Errors.NotFoundError(screensErrors.noUnauthorizedScreenConnection({ code }));
    }

    if (!connection.clientId) {
      throw new Errors.InternalError(screensErrors.clientIdMissing({ code }));
    }

    await sendAuthSuccess(connection, connection.clientId, { screenId: code });
  }
}


export default new ScreensService();
