import { CollectionOptionSort, ModelToColumnsMapping } from '../../../components/general/general.types';

export function convertModelSortRulesToTableSortRules(sortRules: Array<CollectionOptionSort>, columns: ModelToColumnsMapping<unknown>) {
  return sortRules.map((sortRule) => {
    const { column, order, nulls } = sortRule;

    return { column: columns[column], order, nulls };
  });
}
