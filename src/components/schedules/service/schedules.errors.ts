import { ApiError } from '../../../errors/error.types';
import { ScheduleId } from './schedules.types';

const schedulesErrors = {
  withSuchIdNotFound: (context: { scheduleId: ScheduleId }): ApiError => ({
    errorType: 'schedules.withSuchIdNotFound',
    message: 'Schedule with such id not found',
    context
  }),

  screenAlreadyHasSchedule: (context: { screenId: string }): ApiError => ({
    errorType: 'schedules.screenAlreadyHasSchedule',
    message: 'Screen already has schedule',
    context
  }),

  noScheduleForScreen: (context: { screenId: string }): ApiError => ({
    errorType: 'schedules.noScheduleForScreen',
    message: 'No schedule for screen',
    context
  }),
};

export default schedulesErrors;
