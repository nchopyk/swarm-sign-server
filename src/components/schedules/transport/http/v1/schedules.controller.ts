import scheduleService from '../../../service';
import { ScheduleCreationAttributes, ScheduleServiceUpdatableAttributes } from '../../../service/schedules.types';
import { CollectionOptions } from '../../../../general/general.types';


export class SchedulesController {
  create = async (req, res) => {
    const { organizationId } = req.params;
    const { name, notes, screenId, playlistId } = req.body;

    const newVehicleData: ScheduleCreationAttributes = {
      organizationId,
      screenId,
      playlistId,
      name,
      notes,
    };

    const schedule = await scheduleService.create(newVehicleData);

    return res.status(200).send(schedule);
  };

  getAllForOrganization = async (req, res) => {
    const { organizationId } = req.params;
    const { sort, where } = req.query;

    const collectionOptions: CollectionOptions = { sort, where };
    const collection = await scheduleService.getAllForOrganization(organizationId, collectionOptions);

    return res.status(200).send(collection);
  };

  getByIdForOrganization = async (req, res) => {
    const { organizationId, scheduleId } = req.params;

    const schedule = await scheduleService.getByIdForOrganization({ organizationId, scheduleId });

    return res.status(200).send(schedule);
  };

  updateByIdForOrganization = async (req, res) => {
    const { organizationId, scheduleId } = req.params;
    const { name, notes, screenId, playlistId } = req.body;

    const fieldsToUpdate: ScheduleServiceUpdatableAttributes = { name, notes, screenId, playlistId };
    const updatedSchedule = await scheduleService.updateByIdForOrganization({ organizationId, scheduleId, fieldsToUpdate });

    return res.status(200).send(updatedSchedule);
  };

  deleteByIdForOrganization = async (req, res) => {
    const { organizationId, scheduleId } = req.params;

    await scheduleService.deleteByIdForOrganization({ organizationId, scheduleId });

    return res.status(200).send({ message: 'Schedule deleted successfully.' });
  };
}

export default new SchedulesController();
