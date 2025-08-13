import { NotifyInput } from '../types/types';
import { Mailer, TemplateName } from 'src/core/mailer';
import { env } from 'src/conf/env';
import { UserEntity } from 'src/modules/users/infrastructure/user.entity';
import { notificationRepository } from '../infrastructure/notification.repository';

export async function sendEmails(args: {
  input: NotifyInput;
  users: UserEntity[];
  templateName: TemplateName;
  subject: string;
}) {
  const mailer = new Mailer();
  for (const u of args.users) {
    try {
      await mailer.sendTemplatedMail({
        to: [u.email],
        from: env.RESEND_DOMAIN,
        templateName: args.templateName,
        templateData: {
          name: u.name,
          loginUrl: 'https://app.com',
        },
        language: u.language,
      });
      await notificationRepository.createLogs([
        {
          user_id: u.id,
          event: args.input.event,
          subject: args.subject,
          payload: args.input.payload,
          status: 'sent',
          provider_id: null,
          error: null,
        },
      ]);
    } catch (err) {
      await notificationRepository.createLogs([
        {
          user_id: u.id,
          event: args.input.event,
          subject: null,
          payload: args.input.payload,
          status: 'failed',
          provider_id: null,
          error: String(err),
        },
      ]);
    }
  }
}
