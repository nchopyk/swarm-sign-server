import Joi from 'joi';
import { PlaylistModel, PlaylistMediaModel } from './playlists.types';


const playlist: Record<keyof Omit<PlaylistModel, 'organizationId'>, Joi.Schema> = {
  id: Joi.string().uuid(),
  name: Joi.string().min(1).max(255),
  notes: Joi.string().min(1).max(1000).allow(null),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};

const playlistMedias: Record<keyof Omit<PlaylistMediaModel, 'playlistId' | 'mediaId'>, Joi.Schema> = {
  id: Joi.string().uuid(),
  duration: Joi.number().integer().min(0),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
};

export default {
  playlist,
  playlistMedias,
};
