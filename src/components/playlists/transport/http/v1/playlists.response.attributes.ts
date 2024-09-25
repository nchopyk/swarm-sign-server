import { ResponseAttributes } from '../../../../general/general.types';
import { PlaylistModel } from '../../../service/playlists.types';


export const playlist: ResponseAttributes<Omit<PlaylistModel, 'organizationId'>> = {
  id: { type: 'string' },
  name: { type: 'string' },
  notes: { type: 'string', nullable: true },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};


export default {
  playlist,
};
