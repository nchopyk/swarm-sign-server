import Errors from '../../../errors';
import schedulesErrors from './schedules.errors';
import schedulesRepository from './schedules.repository';
import playlistsRepository from '../../playlists/service/playlists.repository';
import screensRepository from '../../screens/service/screens.repository';
import screensErrors from '../../screens/service/screens.errors';
import playlistsErrors from '../../playlists/service/playlists.errors';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { Collection, CollectionOptions } from '../../general/general.types';
import { GetScheduleByIdFuncParams, ScheduleCreationAttributes, ScheduleDTO, ScheduleId, UpdateByIdForOrganizationFuncParams } from './schedules.types';


class SchedulesService {
  public async create(newScheduleData: ScheduleCreationAttributes) {
    const [screen, playlist] = await Promise.all([
      screensRepository.getModelById(newScheduleData.screenId),
      playlistsRepository.getModelById(newScheduleData.playlistId)
    ]);

    if (!screen) {
      throw new Errors.BadRequest(screensErrors.withSuchIdNotFound({ screenId: newScheduleData.screenId }));
    }

    if (!playlist) {
      throw new Errors.BadRequest(playlistsErrors.withSuchIdNotFound({ playlistId: newScheduleData.playlistId }));
    }

    const newScheduleId = await schedulesRepository.create(newScheduleData);

    return await this.getByIdForOrganization({ organizationId: newScheduleData.organizationId, scheduleId: newScheduleId });
  }

  public async getAllForOrganization(organizationId: OrganizationId, collectionOptions: CollectionOptions): Promise<Collection<ScheduleDTO>> {
    const schedules = await schedulesRepository.getDTOsCollectionForOrganization(organizationId, collectionOptions);

    return {
      data: schedules,
    };
  }

  public async getByIdForOrganization({ organizationId, scheduleId }: GetScheduleByIdFuncParams): Promise<ScheduleDTO> {
    const schedule = await schedulesRepository.getDTOByIdForOrganization({ organizationId, scheduleId });

    if (!schedule) {
      throw new Errors.NotFoundError(schedulesErrors.withSuchIdNotFound({ scheduleId }));
    }

    return schedule;
  }

  public async updateByIdForOrganization({ organizationId, scheduleId, fieldsToUpdate }: UpdateByIdForOrganizationFuncParams) {
    const [schedule, screen, playlists] = await Promise.all([
      schedulesRepository.getModelByIdForOrganization({ scheduleId, organizationId }),
      fieldsToUpdate.screenId && screensRepository.getModelById(fieldsToUpdate.screenId),
      fieldsToUpdate.playlistId && playlistsRepository.getModelById(fieldsToUpdate.playlistId)
    ]);

    if (!schedule) {
      throw new Errors.NotFoundError(schedulesErrors.withSuchIdNotFound({ scheduleId }));
    }

    if (fieldsToUpdate.screenId && !screen) {
      throw new Errors.BadRequest(screensErrors.withSuchIdNotFound({ screenId: fieldsToUpdate.screenId }));
    }

    if (fieldsToUpdate.playlistId && !playlists) {
      throw new Errors.BadRequest(playlistsErrors.withSuchIdNotFound({ playlistId: fieldsToUpdate.playlistId }));
    }

    await schedulesRepository.update(scheduleId, fieldsToUpdate);

    return await this.getByIdForOrganization({ organizationId, scheduleId });
  }

  public async deleteByIdForOrganization({ organizationId, scheduleId }: { organizationId: OrganizationId, scheduleId: ScheduleId }) {
    const schedule = await schedulesRepository.getModelByIdForOrganization({ scheduleId, organizationId });

    if (!schedule) {
      throw new Errors.NotFoundError(schedulesErrors.withSuchIdNotFound({ scheduleId }));
    }

    await schedulesRepository.delete(scheduleId);
  }
}


export default new SchedulesService();
