export const filterKeysWithoutValue = (obj: object): object => Object.entries(obj).reduce((acc, [key, value]) => {
  if (value !== undefined) {
    acc[key] = value;
  }

  return acc;
}, {});

export const areAllValuesNull = (obj: object): boolean => Object.values(obj).every((value) => value === null);
