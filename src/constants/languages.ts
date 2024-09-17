const LANGUAGES = {
  EN_US: 'en-US',
} as const;

export type LanguageType = typeof LANGUAGES[keyof typeof LANGUAGES];

export default LANGUAGES;
