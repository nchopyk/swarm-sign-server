import { CollectionOptionSort, SortRules } from '../../../components/general/general.types';
import Joi from 'joi';


const sortParamsSchema = Joi.object({
  order: Joi.string().valid('asc', 'desc').default('asc'),
  nulls: Joi.string().valid('first', 'last'),
});

function handleQueryParams({ columns, defaultValue }: { columns: string[]; defaultValue: SortRules }) {
  return Joi.object().pattern(Joi.string().valid(...columns), sortParamsSchema)
    .default(resolveSortRules(defaultValue))
    .custom(resolveSortRules);
}

function resolveSortRules(values: SortRules): CollectionOptionSort[] {
  return Object
    .entries(values)
    .map(([column, { order, nulls }]) => ({ column, order, nulls }));
}

export default { handleQueryParams };
