import { ApiError } from '../../../errors/error.types';
import { ScheduleId } from './schedules.types';

const schedulesErrors = {
  withSuchIdNotFound: (context: { scheduleId: ScheduleId }): ApiError => ({
    errorType: 'schedules.withSuchIdNotFound',
    message: 'Schedule with such id not found',
    context
  }),
};

export default schedulesErrors;
