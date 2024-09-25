import { ApiError } from '../../../errors/error.types';
import { MediaId, MediaName } from './medias.types';


const mediasErrors = {
  notCreated: (context: { mediaName: MediaName }): ApiError => ({
    errorType: 'medias.notCreated',
    message: `Media with name=${context.mediaName} not created`,
    context
  }),

  withSuchIdNotFound: (context: { mediaId: MediaId }): ApiError => ({
    errorType: 'medias.withSuchIdNotFound',
    message: `Media with id=${context.mediaId} not found`,
    context
  }),

  notDeleted: (context: { mediaId: MediaId }): ApiError => ({
    errorType: 'medias.notDeleted',
    message: `Media with id=${context.mediaId} not deleted`,
    context
  }),

  notMultipartFormData: (): ApiError => ({
    errorType: 'medias.notMultipartFormData',
    message: 'Content-Type must be multipart/form-data',
  }),

  noFieldsProvided: (): ApiError => ({
    errorType: 'medias.noFieldsProvided',
    message: 'No fields provided in multipart/form-data',
  }),
};


export default mediasErrors;
