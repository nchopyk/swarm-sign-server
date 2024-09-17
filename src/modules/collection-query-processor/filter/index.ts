import Joi from 'joi';
import { FiltersSchema } from './types';
import operations from './filter.operations';
import Errors from '../../../errors';
import generalErrors from '../../../components/general/general.errors';

function handleQueryParams(filtersSchema: FiltersSchema) {
  const column = Joi.string().valid(...Object.keys(filtersSchema));

  const conditionsSchema = Joi.custom((conditions: Record<string, unknown>, helpers) => {
    const column = helpers.state.path?.at(-1);

    if (!column) {
      throw new Errors.InternalError(generalErrors.propertyNotFoundInRequestObject({ property: 'column' }));
    }

    validateConditions(column, conditions, filtersSchema);

    return conditions;
  });

  return Joi.array()
    .items(
      Joi.object()
        .pattern(operations.OR, Joi.array().items(Joi.object().pattern(column, conditionsSchema)).single())
        .pattern(operations.AND, Joi.array().items(Joi.object().pattern(column, conditionsSchema)).single())
        .pattern(column, conditionsSchema)
    )
    .single()
    .default([]);
}

function validateConditions(column: string, conditions: Record<string, unknown>, filterColumnsSchema: FiltersSchema) {
  Object.entries(conditions).forEach((condition) => {
    const [operator, rawValue] = condition as [string, unknown];

    if (!(<string[]>Object.values(operations)).includes(operator)) {
      throw new Error(`operator "${operator}" is not supported globally`);
    }

    const filterColumnSchema = filterColumnsSchema[column];

    if (!filterColumnSchema) {
      throw new Error(`column "${column}" is not supported for filtering`);
    }

    if (filterColumnSchema.allowedOperations && !filterColumnSchema.allowedOperations.includes(operator)) {
      throw new Error(`operator "${operator}" is not supported for column "${column}"`);
    }

    let conditionValidator: Joi.Schema;

    if (operator === operations.IN || operator === operations.NOT_IN) {
      conditionValidator = Joi.array().items(filterColumnSchema.validator).min(1);
    } else if (operator === operations.BETWEEN) {
      conditionValidator = Joi.array().items(filterColumnSchema.validator).length(2);
    } else if (operator === operations.GEO_WITHIN) {
      conditionValidator = Joi.array().items(filterColumnSchema.validator).min(3);
    } else {
      conditionValidator = filterColumnSchema.validator;
    }

    const { error, value } = conditionValidator.validate(operator === operations.NULL || operator === operations.NOT_NULL ? null : rawValue);

    if (error) {
      throw error;
    }

    conditions[operator] = value;
  });
}

export default {
  operations,
  handleQueryParams,
};
