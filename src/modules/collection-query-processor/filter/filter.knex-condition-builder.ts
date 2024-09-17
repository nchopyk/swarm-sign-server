import { Knex } from 'knex';
import filterOperations from './filter.operations';
import Errors from '../../../errors';
import generalErrors from '../../../components/general/general.errors';
import operations from './filter.operations';
import { CollectionRootWhere, CollectionWhere, Coordinates, ModelToColumnsMapping } from '../../../components/general/general.types';
import { ConditionType } from './types';

export const operatorsToKnexFunctionMap = {
  [filterOperations.EQ]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, value) : builder.where(column, value),

  [filterOperations.NE]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhereNot(column, value) : builder.whereNot(column, value),

  [filterOperations.LT]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, '<', value) : builder.where(column, '<', value),

  [filterOperations.LTE]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, '<=', value) : builder.where(column, '<=', value),

  [filterOperations.GT]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, '>', value) : builder.where(column, '>', value),

  [filterOperations.GTE]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, '>=', value) : builder.where(column, '>=', value),

  [filterOperations.IN]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string[]) =>
    conditionType === operations.OR ? builder.orWhereIn(column, value) : builder.whereIn(column, value),

  [filterOperations.NOT_IN]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string[]) =>
    conditionType === operations.OR ? builder.orWhereNotIn(column, value) : builder.whereNotIn(column, value),

  [filterOperations.CONTAINS]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, 'like', `%${value}%`) : builder.where(column, 'like', `%${value}%`),

  [filterOperations.CONTAINS_I]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, 'ilike', `%${value}%`) : builder.where(column, 'ilike', `%${value}%`),

  [filterOperations.NOT_CONTAINS]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhereNot(column, 'like', `%${value}%`) : builder.whereNot(column, 'like', `%${value}%`),

  [filterOperations.NOT_CONTAINS_I]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhereNot(column, 'ilike', `%${value}%`) : builder.whereNot(column, 'ilike', `%${value}%`),

  [filterOperations.NULL]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string) =>
    conditionType === operations.OR ? builder.orWhereNull(column) : builder.whereNull(column),

  [filterOperations.NOT_NULL]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string) =>
    conditionType === operations.OR ? builder.orWhereNotNull(column) : builder.whereNotNull(column),

  [filterOperations.BETWEEN]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: [number, number]) =>
    conditionType === operations.OR ? builder.orWhereBetween(column, value) : builder.whereBetween(column, value),

  [filterOperations.STARTS_WITH]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, 'like', `${value}%`) : builder.where(column, 'like', `${value}%`),

  [filterOperations.STARTS_WITH_I]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, 'ilike', `${value}%`) : builder.where(column, 'ilike', `${value}%`),

  [filterOperations.ENDS_WITH]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, 'like', `%${value}`) : builder.where(column, 'like', `%${value}`),

  [filterOperations.ENDS_WITH_I]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhere(column, 'ilike', `%${value}`) : builder.where(column, 'ilike', `%${value}`),

  [filterOperations.DATE_IS]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: string) =>
    conditionType === operations.OR ? builder.orWhereRaw(`DATE(${column}) = DATE(?)`, value) : builder.whereRaw(`DATE(${column}) = DATE(?)`, value),
  [filterOperations.GEO_WITHIN]: (builder: Knex.QueryBuilder, conditionType: ConditionType, column: string, value: Array<Coordinates>) => {
    value.push(value[0]); // duplicate first point to close the polygon

    const points = value.map((point) => `ST_MakePoint(${point.lng}, ${point.lat})`).join(', ');
    const line = `ST_MakeLine(ARRAY[${points}])`;
    const polygon = `ST_MakePolygon(${line})`;
    const polygonWithSRID = `ST_SetSRID(${polygon}::geometry, 4326)`;

    return conditionType === operations.OR ?
      builder.orWhereRaw(`ST_Contains(${polygonWithSRID}, ${column}::geometry)`) :
      builder.whereRaw(`ST_Contains(${polygonWithSRID}, ${column}::geometry)`);
  }
};

export const convertFiltersToQueryCondition = (builder: Knex.QueryBuilder, filters: CollectionWhere, modelToColumnsMapping: ModelToColumnsMapping<unknown>): void => {
  for (const rootWhere of filters) {
    resolveFilter(builder, rootWhere, modelToColumnsMapping);
  }
};

function resolveFilter(
  builder: Knex.QueryBuilder,
  filter: CollectionRootWhere,
  modelToColumnsMapping: ModelToColumnsMapping<unknown>,
  conditionType: '$and' | '$or' = operations.AND
): void {
  for (const key in filter) {
    if (key === operations.AND || key === operations.OR) {
      builder.andWhere((subBuilder) => {
        for (const subCondition of filter[key]) {
          resolveFilter(subBuilder, subCondition, modelToColumnsMapping, key);
        }
      });
    } else {
      const condition = filter[key];

      for (const [operator, value] of Object.entries(condition)) {
        const knexFunction = operatorsToKnexFunctionMap[operator];
        const column = modelToColumnsMapping[key];

        if (!knexFunction) {
          throw new Errors.InternalError(generalErrors.queryOperatorNotSupported({ operator }));
        }

        if (!column) {
          throw new Errors.InternalError(generalErrors.noMappingForColumn({ column: key }));
        }

        knexFunction(builder, conditionType, column, value);
      }
    }
  }
}
