import { Knex } from 'knex';
import { TokenTypeValue } from '../../constants/token-types';


/* ---------------------------- Response Types ---------------------------- */
export interface ResponseProperty {
  type: string;
  default?: string;
  nullable?: boolean;
  format?: string;
  items?: ResponseProperty;
  additionalProperties?: true;
  properties?: Record<string, ResponseProperty>;
}

export interface Resource {
  resourceType: ResponseProperty;
}

export type ResponseAttributes<TModel> = Record<keyof TModel, ResponseProperty>;

export type DTOResource<TModel> = ResponseAttributes<TModel> & Resource;
/* ---------------------------- Response Types ---------------------------- */


/* ---------------------------- Collection Types ---------------------------- */
export interface Pagination {
  from: number;
  to: number;
  total: number;
  pageSize: number;
  currentPage: number;
  lastPage: number;
}

export interface Collection<T> {
  data: T[];
  // meta: Pagination;
}

export interface CollectionResource<T> extends Resource, Collection<T> {
  dataType: ResponseProperty;
}

export interface CollectionWhereSelector<T = string | number | boolean> {
  $eq?: T;
  $ne?: T;
  $lt?: T;
  $lte?: T;
  $gt?: T;
  $gte?: T;
  $in?: T[];
  $notIn?: T[];
  $contains?: T;
  $notContains?: T;
  $containsI?: T;
  $notContainsI?: T;
  $null?: boolean;
  $notNull?: boolean;
  $between?: T extends number ? [number, number] : never;
  $startsWith?: T extends string ? string : never;
  $endsWith?: T extends string ? string : never;
}

export type Condition = Record<string, CollectionWhereSelector>;

export type CollectionRootWhere = { $or?: Condition | Condition[]; $and?: Condition | Condition[]; } | Condition[];

export type CollectionWhere = CollectionRootWhere[];

export interface CollectionOptionPage {
  number: number;
  size: number;
}

type SortOrder = 'asc' | 'desc';
type NullsPosition = 'first' | 'last';

interface SortRule {
  order: SortOrder;
  nulls?: NullsPosition;
}

export type SortRules = Record<string, SortRule>;

export type CollectionOptionSort = {
  column: string;
  order: 'asc' | 'desc';
  nulls?: 'first' | 'last';
};

export interface CollectionOptions {
  // page: CollectionOptionPage;
  sort: CollectionOptionSort[];
  where: CollectionWhere;
}

// export interface CollectionRepositoryOptions extends Omit<CollectionOptions, 'page'> {
//   skip: number;
//   limit: number;
// }

/* ---------------------------- Coordinates Types ---------------------------- */
export interface Coordinates {
  lat: number;
  lng: number;
}

/* ---------------------------- Coordinates Types ---------------------------- */

/* ---------------------------- Repositories Types ---------------------------- */
export type ModelToColumnsMapping<TModel> = Record<keyof TModel, string | Knex.Raw>;
export type ModelToPrefixedColumnsMapping = Record<string, string | Knex.Raw>; // TODO: Improve type
/* ---------------------------- Repositories Types ---------------------------- */

/* ---------------------------- General Types ---------------------------- */
export interface TokenPayload {
  tokenType: TokenTypeValue;
}

export interface CountDTO {
  count: number;
}
/* ---------------------------- General Types ---------------------------- */


/* ---------------------------- Other ---------------------------- */
export interface AddTablePrefixToColumnsFuncOptions {
  includePrefixInAliases?: boolean;
  relationColumn?: boolean;
  specialColumns?: Record<string, string | Knex.Raw>;
}

/* ---------------------------- Other ---------------------------- */

/* ---------------------------- Generic Types ---------------------------- */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

/* ---------------------------- Generic Types ---------------------------- */
