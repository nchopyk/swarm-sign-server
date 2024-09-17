import { ApiError } from '../../../errors/error.types';

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
};

export default screensErrors;
