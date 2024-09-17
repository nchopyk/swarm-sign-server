import { InternalError } from '../../errors';
import logger from '../../modules/logger';
import { FastifyRequest, FastifyReply, } from 'fastify';
import { ValidationError } from 'joi';
import { ApiErrorWithResourceType, ApiValidationError } from '../../errors/error.types';

const httpStatusCodesToErrorsMap: Record<string, number> = {
  BadRequest: 400,
  UnauthorizedError: 401,
  ForbiddenError: 403,
  NotFoundError: 404,
  TimeoutError: 408,
  ConflictError: 409,
  ProcessingError: 422,
  PasswordRequiredError: 422,
  ServerError: 500
};

const errorHandler = (error: InternalError | ValidationError | Error, req: FastifyRequest, res: FastifyReply) => {
  logger.error(error, { tag: 'HTTP ERROR HANDLER' });

  if (error instanceof ValidationError) {
    return res.status(400).send({
      violations: error.details,
      resourceType: 'validationError'
    } satisfies ApiValidationError);
  }

  if (error instanceof InternalError) {
    const constructorName = error.constructor.name;
    const statusCode = httpStatusCodesToErrorsMap[constructorName] || 500;

    return res.status(statusCode).send({
      errorType: error.errorType,
      message: error.message,
      context: error.context || null,
      resourceType: 'error',
    } satisfies ApiErrorWithResourceType);
  }

  return res.status(500).send({
    errorType: 'internal.unexpectedError',
    message: 'Unexpected error',
    context: null,
    resourceType: 'error',
  } satisfies ApiErrorWithResourceType);
};

export default errorHandler;
