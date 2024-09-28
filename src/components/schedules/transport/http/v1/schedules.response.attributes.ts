import { ResponseAttributes } from '../../../../general/general.types';
import { ScheduleModel } from '../../../service/schedules.types';


export const schedule: ResponseAttributes<Omit<ScheduleModel, 'organizationId' | 'screenId' | 'playlistId'>> = {
  id: { type: 'string' },
  name: { type: 'string' },
  notes: { type: 'string', nullable: true },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};


export default {
  schedule,
};
