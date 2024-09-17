const operations = {
  AND: '$and',
  OR: '$or',

  EQ: '$eq',
  NE: '$ne',

  LT: '$lt',
  LTE: '$lte',
  GT: '$gt',
  GTE: '$gte',

  IN: '$in',
  NOT_IN: '$notIn',

  CONTAINS: '$contains',
  CONTAINS_I: '$containsI',
  NOT_CONTAINS: '$notContains',
  NOT_CONTAINS_I: '$notContainsI',

  NULL: '$null',
  NOT_NULL: '$notNull',

  BETWEEN: '$between',

  STARTS_WITH: '$startsWith',
  STARTS_WITH_I: '$startsWithI',
  ENDS_WITH: '$endsWith',
  ENDS_WITH_I: '$endsWithI',

  DATE_IS: '$dateIs',

  GEO_WITHIN: '$geoWithin'
} as const;

export const nullableOperations = [
  operations.NULL,
  operations.NOT_NULL,
];

export const numericOperations = [
  operations.EQ,
  operations.NE,
  operations.LT,
  operations.LTE,
  operations.GT,
  operations.GTE,
  operations.IN,
  operations.NOT_IN,
  operations.BETWEEN,
  operations.NULL,
  operations.NOT_NULL,
];

export const stringOperations = [
  operations.EQ,
  operations.NE,
  operations.IN,
  operations.NOT_IN,
  operations.CONTAINS,
  operations.CONTAINS_I,
  operations.NOT_CONTAINS,
  operations.NOT_CONTAINS_I,
  operations.STARTS_WITH,
  operations.STARTS_WITH_I,
  operations.ENDS_WITH,
  operations.ENDS_WITH_I,
  operations.NULL,
  operations.NOT_NULL,
];

export const dateOperations = [
  ...numericOperations,
  operations.DATE_IS,
];

export const booleanOperations = [
  operations.EQ,
  operations.NE,
  operations.NULL,
  operations.NOT_NULL,
];

export const coordinatesOperations = [
  operations.EQ,
  operations.NE,
  operations.NULL,
  operations.NOT_NULL,
  operations.GEO_WITHIN
];

export default operations;
