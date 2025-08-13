import { AppEvents } from 'src/core/event-bus';
import { TemplateName } from 'src/core/mailer';

export type ChannelMap = {
  email: NotifyInput & { templateName: TemplateName; subject: string };
  in_app: NotifyInput;
  all: ChannelMap['email'] & ChannelMap['in_app'];
};

export type Audience = { kind: 'users'; userIds: string[]; tenantId?: string };

export type NotifyInput<E extends keyof AppEvents = keyof AppEvents> = {
  event: E;
  payload: AppEvents[E];
  audience: Audience;
  channel: keyof ChannelMap;
  channel_payload: ChannelMap[keyof ChannelMap];
};
