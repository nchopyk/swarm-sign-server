import { ApiError } from '../../../errors/error.types';
import { MediaCreationAttributes, MediaId } from './medias.types';


const mediasErrors = {
  notCreated: (context: { mediaData: MediaCreationAttributes }): ApiError => ({
    errorType: 'medias.notCreated',
    message: `Media was not created`,
    context
  }),

  withSuchIdNotFound: (context: { mediaId: MediaId }): ApiError => ({
    errorType: 'medias.withSuchIdNotFound',
    message: `Media with id=${context.mediaId} not found`,
    context
  }),
};


export default mediasErrors;
