import Errors from '../../../errors';
import generalErrors from '../general.errors';
import { AddTablePrefixToColumnsFuncOptions, ModelToColumnsMapping } from '../general.types';
import { Knex } from 'knex';

type ModelWithKnexRaw<M> = {
  [P in keyof M]?: M[P] | Knex.Raw;
};

export const convertFieldsToColumns = <M>(fields: ModelWithKnexRaw<M>, columnsMapping: ModelToColumnsMapping<M>): Record<string, string> => { // TODO: improve types
  const columns = Object.entries(fields as object).reduce((acc, [key, value]) => {
    const column = columnsMapping[key];

    if (!column) {
      throw new Errors.InternalError(generalErrors.noMappingForColumn({ column: key }));
    }

    if (value === undefined) {
      return acc;
    }

    acc[column] = value;
    return acc;
  }, {});

  return columns;
};


// eslint-disable-next-line max-len
export const addTablePrefixToColumns = <M>(columns: ModelToColumnsMapping<M>, table: string, options?: AddTablePrefixToColumnsFuncOptions): Record<string, string | Knex.Raw> => {
  const includePrefixInAliases = options?.includePrefixInAliases || false;
  const relationColumn = options?.relationColumn || false;
  const specialColumns = options?.specialColumns;

  const columnsWithTablePrefix = Object.entries(columns).reduce((acc, [key, value]) => {
    if (relationColumn && !acc[table]) {
      acc[table] = `${table}.${value}`; // any column can be used as relation column
    }

    specialColumns && specialColumns[key] ?
      acc[includePrefixInAliases ? `${table}.${key}` : key] = specialColumns[key] :
      acc[includePrefixInAliases ? `${table}.${key}` : key] = `${table}.${value}`;

    return acc;
  }, {} as Record<string, string | Knex.Raw>);

  return columnsWithTablePrefix;
};
