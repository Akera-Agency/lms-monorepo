import { Elysia } from 'elysia';
import { eventBus } from '../../core/event-bus';
import { registerNotificationListeners } from 'src/modules/notifications/events';

export const eventBusPlugin = new Elysia({ name: 'event-bus' })
  .decorate('eventBus', eventBus)
  .onStart(() => {
    registerNotificationListeners();
  });
