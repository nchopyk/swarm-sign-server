import connectionsManager from '../transport/ws/connections-manager';
import Errors from '../../../errors';
import screensErrors from './screens.errors';
import { sendAuthSuccess, sendReset } from '../transport/ws/screens.ws.event-senders';
import { GetScreenByIdFuncParams, ScreenCreationAttributes, ScreenDTO, ScreenId, UpdateByIdForOrganizationFuncParams } from './screens.types';
import organizationsRepository from '../../organizations/service/organizations.repository';
import organizationsErrors from '../../organizations/service/organizations.errors';
import screensRepository from './screens.repository';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { Collection, CollectionOptions } from '../../general/general.types';


class ScreensService {
  public async create(newScreenData: ScreenCreationAttributes) {
    const organization = await organizationsRepository.getModelById(newScreenData.organizationId);

    if (!organization) {
      throw new Errors.BadRequest(organizationsErrors.withSuchIdNotFound({ organizationId: newScreenData.organizationId }));
    }

    const newScreenId = await screensRepository.create(newScreenData);

    const newScreen = await screensRepository.getModelById(newScreenId);

    if (!newScreen) {
      throw new Errors.InternalError(screensErrors.notCreated({ screenData: newScreenData }));
    }

    return newScreen;
  }

  public async getAllForOrganization(organizationId: OrganizationId, collectionOptions: CollectionOptions): Promise<Collection<ScreenDTO>> {
    const organization = await organizationsRepository.getModelById(organizationId);

    if (!organization) {
      throw new Errors.NotFoundError(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    const screens = await screensRepository.getDTOsCollectionForOrganization(organizationId, collectionOptions);

    return {
      data: screens,
    };
  }

  public async getByIdForOrganization({ organizationId, screenId }: GetScreenByIdFuncParams): Promise<ScreenDTO> {
    const screen = await screensRepository.getDTOByIdForOrganization({ organizationId, screenId });

    if (!screen) {
      throw new Errors.NotFoundError(screensErrors.withSuchIdNotFound({ screenId }));
    }

    return screen;
  }

  public async updateByIdForOrganization({ organizationId, screenId, fieldsToUpdate }: UpdateByIdForOrganizationFuncParams) {
    const screen = await screensRepository.getModelByIdForOrganization({ screenId, organizationId });

    if (!screen) {
      throw new Errors.NotFoundError(screensErrors.withSuchIdNotFound({ screenId }));
    }

    await screensRepository.update(screenId, fieldsToUpdate);

    const updatedScreen = await screensRepository.getModelById(screenId);

    if (!updatedScreen) {
      throw new Errors.InternalError(screensErrors.withSuchIdNotFound({ screenId }));
    }

    return updatedScreen;
  }

  public async deleteByIdForOrganization({ organizationId, screenId }: { organizationId: OrganizationId, screenId: ScreenId }) {
    const screen = await screensRepository.getModelByIdForOrganization({ screenId, organizationId });

    if (!screen) {
      throw new Errors.NotFoundError(screensErrors.withSuchIdNotFound({ screenId }));
    }

    await screensRepository.delete(screenId);
  }

  async activate(screenId: ScreenId, code: string) {
    const screen = await screensRepository.getModelById(screenId);

    if (!screen) {
      throw new Errors.NotFoundError(screensErrors.withSuchIdNotFound({ screenId }));
    }

    const connection = connectionsManager.unauthorizedConnections.get(code);

    if (!connection) {
      throw new Errors.NotFoundError(screensErrors.noUnauthorizedScreenConnection({ code }));
    }

    if (!connection.clientId) {
      throw new Errors.InternalError(screensErrors.clientIdMissing({ code }));
    }

    await screensRepository.update(screenId, { deviceId: connection.clientId });

    await sendAuthSuccess(connection, connection.clientId, { screenId });
  }

  async deactivate(screenId: ScreenId) {
    const screen = await screensRepository.getModelById(screenId);

    if (!screen) {
      throw new Errors.NotFoundError(screensErrors.withSuchIdNotFound({ screenId }));
    }

    if (!screen.deviceId) {
      throw new Errors.BadRequest(screensErrors.screenIsNotActivated({ screenId }));
    }

    const connection = connectionsManager.authorizedConnections.get(screen.deviceId);

    if (connection) {
      await sendReset(connection, screen.deviceId);
      connectionsManager.authorizedConnections.delete(screen.deviceId, connection);
    }

    await screensRepository.update(screenId, { deviceId: null });
  }
}


export default new ScreensService();
