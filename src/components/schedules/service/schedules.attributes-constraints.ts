import Joi from 'joi';
import { ScheduleModel } from './schedules.types';


const schedule: Record<keyof Omit<ScheduleModel, 'organizationId' | 'playlistId' | 'screenId'>, Joi.Schema> = {
  id: Joi.string().uuid(),
  name: Joi.string().min(1).max(255),
  notes: Joi.string().min(1).max(1000).allow(null),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};


export default {
  schedule,
};
