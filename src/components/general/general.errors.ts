import { ApiError } from '../../errors/error.types';

const generalErrors = {
  propertyNotFoundInRequestObject: (context: { property: string }): ApiError => ({
    errorType: 'general.propertyNotFoundInRequestObject',
    message: `Property ${context.property} not found in request object`,
    context,
  }),

  propertyNotProvided: (context: { property: string }): ApiError => ({
    errorType: 'general.propertyNotProvided',
    message: `Property ${context.property} not provided`,
    context,
  }),

  operationTimedOut: (context: { operation: string }): ApiError => ({
    errorType: 'general.operationTimedOut',
    message: `Operation "${context.operation}" timed out`,
    context,
  }),

  queryOperatorNotSupported: (context: { operator: string }): ApiError => ({
    errorType: 'general.queryOperatorNotSupported',
    message: `Query operator "${context.operator}" is not supported`,
    context,
  }),

  noMappingForColumn: (context: { column: string }): ApiError => ({
    errorType: 'general.noMappingForColumn',
    message: `No model to column mapping for column "${context.column}"`,
    context,
  }),

  invalidMessageFormat: (context: { message: object }): ApiError => ({
    errorType: 'general.invalidMessageFormat',
    message: 'Invalid message format',
    context,
  }),

  invalidJWTTokenType: (): ApiError => ({
    errorType: 'general.invalidJWTTokenType',
    message: 'Invalid token type',
  }),

  invalidJWTToken: (): ApiError => ({
    errorType: 'user.invalidJWTToken',
    message: 'Invalid token',
  }),

  noValueInMapping: (context: { value: string | number }): ApiError => ({
    errorType: 'general.noValueInMapping',
    message: `No value in mapping for value "${context.value}"`,
    context,
  }),

};

export default generalErrors;
