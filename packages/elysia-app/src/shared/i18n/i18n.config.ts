import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { LanguagesEnum } from '../constants/i18n';
import { env } from '@akera/env';
import CommonEng from '../../../assets/locales/en/common.json';
import CommonAr from '../../../assets/locales/ar/common.json';
import ErrorsEng from '../../../assets/locales/en/errors.json';
import ErrorsAr from '../../../assets/locales/ar/errors.json';
import ValidationEng from '../../../assets/locales/en/validation.json';
import ValidationAr from '../../../assets/locales/ar/validation.json';
import MessagesEng from '../../../assets/locales/en/messages.json';
import MessagesAr from '../../../assets/locales/ar/messages.json';
import { join } from 'path';

export const initializeI18n = async () => {
  await i18next.use(Backend).init({
    lng: LanguagesEnum.en,
    fallbackLng: LanguagesEnum.en,
    supportedLngs: [LanguagesEnum.en, LanguagesEnum.ar],

    debug: env.NODE_ENV === 'development',

    backend: {
      loadPath: join(process.cwd(), 'assets/locales/{{lng}}/{{ns}}.json'),
      resources: {
        [LanguagesEnum.en]: {
          common: CommonEng,
          errors: ErrorsEng,
          validation: ValidationEng,
          messages: MessagesEng,
        },
        [LanguagesEnum.ar]: {
          common: CommonAr,
          errors: ErrorsAr,
          validation: ValidationAr,
          messages: MessagesAr,
        },
      },
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Namespaces for different parts of the application
    ns: ['common', 'errors', 'validation', 'messages'],
    defaultNS: 'common',

    // Language detection order
    load: 'languageOnly', // en-US -> en

    // Cache options
    cache: {
      enabled: true,
    },
  });

  return i18next;
};

export default i18next;
