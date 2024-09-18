import { ResponseAttributes } from '../../../../general/general.types';
import { ScreenModel } from '../../../service/screens.types';


export const screen: ResponseAttributes<Omit<ScreenModel, 'organizationId'>> = {
  id: { type: 'string' },
  name: { type: 'string' },
  notes: { type: 'string', nullable: true },
  deviceId: { type: 'string', nullable: true },
  location: { type: 'string', nullable: true },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};


export default {
  screen,
};
