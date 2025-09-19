import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { LanguagesEnum } from 'src/shared/constants/i18n';
import { AppError } from 'src/shared/Errors/AppError';
import { Logger } from 'src/shared/logger/logger';
import { env } from '@akera/env';

// We'll implement Handlebars-like functionality without the dependency
// since we can't install it due to permission issues
class SimpleHandlebars {
  static compile(template: string) {
    return (data: Record<string, any>) => {
      return template.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (_, key) => {
        const keys = key.trim().split('.');
        let value = data;

        for (const k of keys) {
          if (value === undefined || value === null) return '';
          value = value[k];
        }

        return value !== undefined && value !== null ? String(value) : '';
      });
    };
  }
}

export interface EmailTemplate {
  html: string;
}

export interface ISendMailOptions {
  to: string[];
  from: string;
  subject: string;
  html: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
  }[];
}

export interface IMailer {
  sendMail: (options: ISendMailOptions) => Promise<void>;
  sendTemplatedMail: <U extends TemplateName, T extends EmailTemplates[U]>(options: {
    to: string[];
    from: string;
    templateName: U;
    templateData: T;
    language?: LanguagesEnum;
    cc?: string[];
    bcc?: string[];
    subject?: string;
    replyTo?: string;
    attachments?: {
      filename: string;
      content: Buffer | string;
    }[];
  }) => Promise<void>;
}

// Email templates
export type EmailTemplates = {
  welcome: {
    loginUrl: string;
    name: string;
  };
};

// Supported languages

export type TemplateName = keyof EmailTemplates;

// User interface for language detection
export interface UserWithLanguage {
  id?: string | number;
  email?: string;
  language?: string;
  preferences?: {
    language?: string;
  };
}

/**
 * Detects the user's preferred language from a user object
 * @param user The user object that may contain language preference
 * @returns The detected language code or default language (EN)
 */
export function detectUserLanguage(user?: UserWithLanguage): LanguagesEnum {
  if (!user) return LanguagesEnum.en;

  // Check direct language property
  if (user.language && isValidLanguage(user.language)) {
    return user.language as LanguagesEnum;
  }

  // Check preferences object
  if (user.preferences?.language && isValidLanguage(user.preferences.language)) {
    return user.preferences.language as LanguagesEnum;
  }

  // Default to English
  return LanguagesEnum.en;
}

/**
 * Checks if the provided language code is supported
 */
function isValidLanguage(language: string): boolean {
  return Object.values(LanguagesEnum).includes(language as LanguagesEnum);
}

class ResendMailer implements IMailer {
  private resend;
  private templatesDir;

  public constructor(options: { key: string; domain: string; templatesDir: string }) {
    this.resend = new Resend(options.key);
    this.templatesDir = options.templatesDir;
  }

  public async sendMail(options: ISendMailOptions) {
    try {
      const response = await this.resend.emails.send({
        to: options.to,
        from: `Name <${env.RESEND_DOMAIN}>`,
        subject: options.subject,
        html: options.html,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        attachments: options.attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content,
        })),
      });

      if (response.error) {
        throw new AppError({
          error: 'failed_to_send_email',
          statusCode: 500,
        });
      }
      Logger.info('Email sent successfully');
    } catch (error) {
      Logger.error('Failed to send email: ' + error);
      throw new AppError({
        error: 'failed_to_send_email',
        statusCode: 500,
      });
    }
  }

  public async sendTemplatedMail<U extends TemplateName, T extends EmailTemplates[U]>(options: {
    to: string[];
    from: string;
    templateName: U;
    templateData: T;
    language?: LanguagesEnum;
    cc?: string[];
    bcc?: string[];
    subject?: string;
    replyTo?: string;
    attachments?: {
      filename: string;
      content: Buffer | string;
    }[];
  }) {
    const language = options.language || LanguagesEnum.en;
    const template = await this.getTemplate(options.templateName, language);
    const compiledHtmlTemplate = SimpleHandlebars.compile(template.html);

    const html = compiledHtmlTemplate(options.templateData);

    await this.sendMail({
      to: options.to,
      from: options.from,
      subject: options.subject ?? 'Notification',
      html,
      cc: options.cc,
      bcc: options.bcc,
      replyTo: options.replyTo,
      attachments: options.attachments,
    });
  }

  private async getTemplate(
    templateName: TemplateName,
    language: LanguagesEnum,
  ): Promise<EmailTemplate> {
    try {
      // Try to find a localized .hbs template first
      const localizedPath = path.join(this.templatesDir, language, `${templateName}.hbs`);
      let templateContent: string;

      try {
        // Try localized .hbs template
        templateContent = await fs.promises.readFile(localizedPath, 'utf-8');
      } catch (err) {
        Logger.error(
          `Failed to load email template ${templateName} for language ${language}:` + String(err),
        );
        throw new AppError({
          error: 'failed_to_load_email_template',
          statusCode: 500,
        });
      }

      // Remove the subject comment from the HTML
      const html = templateContent.replace(/<!--\s*Subject:\s*(.*?)\s*-->/, '');

      return { html };
    } catch (error) {
      Logger.error(
        `Failed to load email template ${templateName} for language ${language}:` + String(error),
      );
      throw new AppError({
        error: 'failed_to_load_email_template',
        statusCode: 500,
      });
    }
  }
}

export class Mailer implements IMailer {
  private mailer: IMailer;
  private templatesDir: string;

  public constructor() {
    // Set templates directory relative to project root
    this.templatesDir = path.join(process.cwd(), 'packages/elysia-app/assets/templates/emails');

    this.mailer = new ResendMailer({
      key: env.RESEND_API_KEY,
      domain: env.RESEND_DOMAIN,
      templatesDir: this.templatesDir,
    });
  }

  public async sendMail(options: ISendMailOptions) {
    await this.mailer.sendMail(options);
  }

  public async sendTemplatedMail<U extends TemplateName, T extends EmailTemplates[U]>(options: {
    to: string[];
    from: string;
    templateName: U;
    templateData: T;
    language?: LanguagesEnum;
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
    attachments?: {
      filename: string;
      content: Buffer | string;
    }[];
  }) {
    await this.mailer.sendTemplatedMail(options);
  }
}
