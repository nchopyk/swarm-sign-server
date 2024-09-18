import Joi from 'joi';
import { ScreenModel } from './screens.types';


const screen: Record<keyof Omit<ScreenModel, 'organizationId'>, Joi.Schema> = {
  id: Joi.string().uuid(),
  name: Joi.string().min(1).max(255),
  notes: Joi.string().min(1).max(1000).allow(null),
  deviceId: Joi.string().uuid().allow(null),
  location: Joi.string().min(1).max(255).allow(null),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};


export default {
  screen,
};
