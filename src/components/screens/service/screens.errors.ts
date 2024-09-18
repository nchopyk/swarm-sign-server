import { ApiError } from '../../../errors/error.types';
import { ScreenCreationAttributes, ScreenId } from './screens.types';

const screensErrors = {
  noUnauthorizedScreenConnection: (context: { code: string }): ApiError => ({
    errorType: 'screens.noUnauthorizedScreenConnection',
    message: `No unauthorized screen with code=${context.code} found`,
    context
  }),

  clientIdMissing: (context: { code: string }): ApiError => ({
    errorType: 'screens.clientIdMissing',
    message: `Client ID missing for screen with code=${context.code}`,
    context
  }),

  notCreated: (context: { screenData: ScreenCreationAttributes }): ApiError => ({
    errorType: 'screens.notCreated',
    message: `Screen was not created`,
    context
  }),

  withSuchIdNotFound: (context: { screenId: ScreenId }): ApiError => ({
    errorType: 'screens.withSuchIdNotFound',
    message: `Screen with id=${context.screenId} not found`,
    context
  }),
};

export default screensErrors;
