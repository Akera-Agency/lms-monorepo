import i18next from 'i18next';
import { LanguagesEnum } from '../constants/i18n';
import {
  AllTranslationKeys,
  TranslationContext,
  CommonKeys,
  ErrorsKeys,
  ValidationKeys,
  MessagesKeys,
  Namespace,
  MessageContext,
  ValidationContext,
  CommonContext,
  ErrorsContext,
} from './generated-types';

export interface TypeSafeI18nService {
  // Generic translation method with full type safety
  t<T extends AllTranslationKeys>(key: T, context?: TranslationContext): string;

  // Namespace-specific methods for better developer experience
  common<T extends CommonKeys>(key: T, context?: CommonContext): string;

  error<T extends ErrorsKeys>(key: T, context?: ErrorsContext): string;

  validation<T extends ValidationKeys>(
    field: T,
    context?: ValidationContext
  ): string;

  message<T extends MessagesKeys>(key: T, context?: MessageContext): string;

  // Language management
  changeLanguage(lng: LanguagesEnum): Promise<void>;
  getCurrentLanguage(): LanguagesEnum;
  getAvailableLanguages(): LanguagesEnum[];

  // Utility methods
  isLanguageSupported(lng: string): lng is LanguagesEnum;
}

export class TypeSafeI18nServiceImpl implements TypeSafeI18nService {
  private currentLanguage: LanguagesEnum = LanguagesEnum.en;

  constructor() {
    this.currentLanguage =
      (i18next.language as LanguagesEnum) || LanguagesEnum.en;
  }

  t<T extends AllTranslationKeys>(
    key: T,
    context?: TranslationContext & {
      ns: Namespace;
    }
  ): string {
    const result = i18next.t(key, {
      lng: this.currentLanguage,
      ...context,
    });
    return result;
  }

  common<T extends CommonKeys>(key: T, context?: CommonContext): string {
    return this.t(key, { ...context, ns: 'common' });
  }

  error<T extends ErrorsKeys>(key: T, context?: ErrorsContext): string {
    return this.t(`${key}` as const, { ...context, ns: 'errors' });
  }

  validation<T extends ValidationKeys>(
    field: T,
    context?: ValidationContext
  ): string {
    return this.t(`${field}` as const, { ...context, ns: 'validation' });
  }

  message<T extends MessagesKeys>(key: T, context?: MessageContext): string {
    return this.t(`${key}` as const, { ...context, ns: 'messages' });
  }

  async changeLanguage(lng: LanguagesEnum): Promise<void> {
    await i18next.changeLanguage(lng);
    this.currentLanguage = lng;
  }

  getCurrentLanguage(): LanguagesEnum {
    return this.currentLanguage;
  }

  getAvailableLanguages(): LanguagesEnum[] {
    return Object.values(LanguagesEnum);
  }

  isLanguageSupported(lng: string): lng is LanguagesEnum {
    return Object.values(LanguagesEnum).includes(lng as LanguagesEnum);
  }
}

// Factory function to create type-safe i18n service
export const createTypeSafeI18nService = (): TypeSafeI18nService => {
  return new TypeSafeI18nServiceImpl();
};

// Default instance
export const typeSafeI18nService = createTypeSafeI18nService();
