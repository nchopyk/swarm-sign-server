import { ApiError } from './error.types';

export class InternalError extends Error implements ApiError {
  public message: string;
  public errorType: string;
  public context?: object | null;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.message = apiError.message;
    this.errorType = apiError.errorType;
    this.context = apiError.context;
  }
}

export class BadRequest extends InternalError {
  constructor(apiError: ApiError) {
    super(apiError);
  }
}

export class UnauthorizedError extends InternalError {
  constructor(apiError: ApiError) {
    super(apiError);
  }
}

export class ForbiddenError extends InternalError {
  constructor(apiError: ApiError) {
    super(apiError);
  }
}

export class NotFoundError extends InternalError {
  constructor(apiError: ApiError) {
    super(apiError);
  }
}

export class TimeoutError extends InternalError {
  constructor(apiError: ApiError) {
    super(apiError);
  }
}

export class ProcessingError extends InternalError {
  constructor(apiError: ApiError) {
    super(apiError);
  }
}

export class PasswordRequiredError extends InternalError {
  constructor(apiError: ApiError) {
    super(apiError);
  }
}

export class ConflictError extends InternalError {
  constructor(apiError: ApiError) {
    super(apiError);
  }
}


export default {
  InternalError,
  BadRequest,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  TimeoutError,
  ConflictError,
  ProcessingError,
  PasswordRequiredError
};
