export const TEMPERATURE = {
  CELSIUS: 'c',
  FAHRENHEIT: 'f'
} as const;

export const DISTANCE = {
  KILOMETER: 'km',
  MILE: 'mi'
} as const;

export const VOLUME = {
  LITER: 'l',
  GALLON: 'gal',
  PERCENTAGE: '%'
} as const;

export type TemperatureUnitType = typeof TEMPERATURE[keyof typeof TEMPERATURE];
export type DistanceUnitType = typeof DISTANCE[keyof typeof DISTANCE];
export type VolumeUnitType = typeof VOLUME[keyof typeof VOLUME];

export default { TEMPERATURE, DISTANCE, VOLUME };
