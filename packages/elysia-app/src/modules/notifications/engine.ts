import type { ChannelMap, NotifyInput } from './types/types';
import * as emailChannel from './channels/email';
import { env } from 'src/conf/env';
import { Logger } from 'src/shared/logger/logger';
import { notificationRepository } from './infrastructure/notification.repository';

export function createNotifier() {
  async function notify(input: NotifyInput) {
    const allRecipients = await notificationRepository.resolveAudience(
      input.audience
    );
    const wantsInApp = input.channel === 'in_app' || input.channel === 'all';
    const wantsEmail = input.channel === 'email' || input.channel === 'all';

    const perRecipient = await Promise.all(
      allRecipients.map(async (u) => {
        const [inAppOk, emailOk] = await Promise.all([
          wantsInApp
            ? notificationRepository.isChannelEnabled(
                u.id,
                input.event,
                'in_app'
              )
            : Promise.resolve(false),
          wantsEmail
            ? notificationRepository.isChannelEnabled(
                u.id,
                input.event,
                'email'
              )
            : Promise.resolve(false),
        ]);
        return { user: u, inAppOk, emailOk };
      })
    );

    const inAppRecipients = perRecipient
      .filter((r) => r.inAppOk)
      .map((r) => r.user);
    const emailRecipients = perRecipient
      .filter((r) => r.emailOk)
      .map((r) => r.user);

    const results = await Promise.allSettled([
      wantsInApp && inAppRecipients.length
        ? notificationRepository.createMany(
            inAppRecipients.map((u) => ({
              user_id: u.id,
              event: input.event,
              template: input.event,
              payload: input.payload,
            }))
          )
        : Promise.resolve(undefined),
      wantsEmail && emailRecipients.length
        ? emailChannel.sendEmails({
            input,
            users: emailRecipients,
            templateName: (input.channel_payload as ChannelMap['email'])
              .templateName,
            subject: (input.channel_payload as ChannelMap['email']).subject,
          })
        : Promise.resolve(undefined),
    ]);

    if (env.NOTIFS_DEBUG === '1') {
      Logger.info(
        JSON.stringify({
          at: 'notifications.engine',
          input,
          recipients: {
            inApp: inAppRecipients.length,
            email: emailRecipients.length,
          },
          outcomes: results.map((r) =>
            r.status === 'fulfilled' ? 'ok' : 'error'
          ),
        })
      );
    }
  }

  return { notify };
}
