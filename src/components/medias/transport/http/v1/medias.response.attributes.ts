import { ResponseAttributes } from '../../../../general/general.types';
import { MediaModel } from '../../../service/medias.types';


export const media: ResponseAttributes<Omit<MediaModel, 'organizationId'>> = {
  id: { type: 'string' },
  name: { type: 'string' },
  notes: { type: 'string', nullable: true },
  content: { type: 'string' },
  thumbnail: { type: 'string' },
  type: { type: 'string' },
  duration: { type: 'number', nullable: true },
  width: { type: 'number', nullable: true },
  height: { type: 'number', nullable: true },
  mimeType: { type: 'string' },
  size: { type: 'number', nullable: true },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};


export default {
  media,
};
