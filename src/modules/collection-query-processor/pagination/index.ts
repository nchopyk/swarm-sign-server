import Joi from 'joi';
import { CollectionOptionPage } from '../../../components/general/general.types';

function handleQueryParams({ defaultValue }: { defaultValue: CollectionOptionPage }) {
  return Joi.object()
    .keys({
      number: Joi.number().integer().min(1).default(defaultValue.number),
      size: Joi.number().integer().min(1).max(100).default(defaultValue.size),
    })
    .default(defaultValue);
}

export default {
  handleQueryParams,
};
