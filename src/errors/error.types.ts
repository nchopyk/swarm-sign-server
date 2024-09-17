import { ValidationErrorItem } from 'joi';

export interface ApiError {
  errorType: string;
  message: string;
  context?: object | null;
}

export interface ApiErrorWithResourceType extends ApiError {
  resourceType: string;
}

export interface ApiValidationError {
  violations: ValidationErrorItem[];
  resourceType: string;
}
