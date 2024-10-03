import Errors from '../../../errors';
import schedulesErrors from './schedules.errors';
import schedulesRepository from './schedules.repository';
import playlistsRepository from '../../playlists/service/playlists.repository';
import screensRepository from '../../screens/service/screens.repository';
import screensErrors from '../../screens/service/screens.errors';
import playlistsErrors from '../../playlists/service/playlists.errors';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { Collection, CollectionOptions } from '../../general/general.types';
import {
  GetScheduleByIdFuncParams,
  ScheduleCreationAttributes,
  ScheduleDTO,
  ScheduleId,
  ScreenScheduleDTO,
  UpdateByIdForOrganizationFuncParams
} from './schedules.types';
import { sendNewScheduleToScreen } from '../transport/ws/schedules.ws.senders';
import schedulesBuilder from './schedules.builder';


class SchedulesService {
  public async create(newScheduleData: ScheduleCreationAttributes) {
    const [screen, playlist, screenSchedule] = await Promise.all([
      screensRepository.getModelById(newScheduleData.screenId),
      playlistsRepository.getModelById(newScheduleData.playlistId),
      schedulesRepository.getModelByScreenId(newScheduleData.screenId)
    ]);

    if (!screen) {
      throw new Errors.BadRequest(screensErrors.withSuchIdNotFound({ screenId: newScheduleData.screenId }));
    }

    if (!playlist) {
      throw new Errors.BadRequest(playlistsErrors.withSuchIdNotFound({ playlistId: newScheduleData.playlistId }));
    }

    if (screenSchedule) {
      throw new Errors.BadRequest(schedulesErrors.screenAlreadyHasSchedule({ screenId: newScheduleData.screenId }));
    }

    const newScheduleId = await schedulesRepository.create(newScheduleData);

    await sendNewScheduleToScreen(newScheduleData.screenId);

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
    const [schedule, screen, playlists, screenSchedule] = await Promise.all([
      schedulesRepository.getModelByIdForOrganization({ scheduleId, organizationId }),
      fieldsToUpdate.screenId && screensRepository.getModelById(fieldsToUpdate.screenId),
      fieldsToUpdate.playlistId && playlistsRepository.getModelById(fieldsToUpdate.playlistId),
      fieldsToUpdate.screenId && schedulesRepository.getModelByScreenId(fieldsToUpdate.screenId)
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

    if (fieldsToUpdate.screenId && screenSchedule) {
      throw new Errors.BadRequest(schedulesErrors.screenAlreadyHasSchedule({ screenId: fieldsToUpdate.screenId }));
    }

    await schedulesRepository.update(scheduleId, fieldsToUpdate);
    await sendNewScheduleToScreen(fieldsToUpdate.screenId || schedule.screenId);

    return await this.getByIdForOrganization({ organizationId, scheduleId });
  }

  public async deleteByIdForOrganization({ organizationId, scheduleId }: { organizationId: OrganizationId, scheduleId: ScheduleId }) {
    const schedule = await schedulesRepository.getModelByIdForOrganization({ scheduleId, organizationId });

    if (!schedule) {
      throw new Errors.NotFoundError(schedulesErrors.withSuchIdNotFound({ scheduleId }));
    }

    await schedulesRepository.delete(scheduleId);
    await sendNewScheduleToScreen(schedule.screenId);
  }

  public async getScreenSchedule(screenId: string): Promise<ScreenScheduleDTO | null> {
    const screen = await screensRepository.getModelById(screenId);

    if (!screen) {
      throw new Errors.NotFoundError(screensErrors.withSuchIdNotFound({ screenId }));
    }

    return schedulesBuilder.buildNew(screenId);
  }
}


export default new SchedulesService();
