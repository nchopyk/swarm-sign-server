import Joi from 'joi';

export const getQueryKeyFromHelpers = (helpers: Joi.CustomHelpers, keyName: string): string => {
  const key = helpers.state.path?.toString();

  if (!key) {
    throw new Error(`key ${keyName} is not defined`);
  }

  return key;
};

export const getQueryParamsFromHelpers = (helpers: Joi.CustomHelpers) => {
  const [query] = helpers.state.ancestors;

  return query;
};
