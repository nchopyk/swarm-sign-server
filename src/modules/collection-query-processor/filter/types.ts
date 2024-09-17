import Joi from 'joi';

export type FilterColumnConfig = {
  validator: Joi.Schema;
  allowedOperations?: Array<string>;
};

export type FiltersSchema = Record<string, FilterColumnConfig>;

export type ConditionType = '$and' | '$or';
