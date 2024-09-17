import AuthorizedConnectionsManager from './AuthorizedConnectionsManager';
import UnauthorizedConnectionsManager from './UnauthorizedConnectionsManager';


const connectionsManager = {
  authorizedConnections: new AuthorizedConnectionsManager(),
  unauthorizedConnections: new UnauthorizedConnectionsManager(),
};


export default connectionsManager;
