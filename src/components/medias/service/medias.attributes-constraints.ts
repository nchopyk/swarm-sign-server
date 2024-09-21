import Joi from 'joi';
import { MediaModel } from './medias.types';
import { MEDIA_TYPES } from './media.constants';


const media: Record<keyof Omit<MediaModel, 'organizationId'>, Joi.Schema> = {
  id: Joi.string().uuid(),
  name: Joi.string().min(1).max(255),
  notes: Joi.string().min(1).max(1000).allow(null),
  content: Joi.string().min(1).max(255),
  type: Joi.string().valid(...Object.values(MEDIA_TYPES)),
  duration: Joi.number().integer().min(0).allow(null),
  mimeType: Joi.string().min(1).max(255),
  size: Joi.number().integer().min(0).allow(null),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};


export default {
  media,
};
