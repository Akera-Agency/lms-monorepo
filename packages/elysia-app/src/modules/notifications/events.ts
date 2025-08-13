import { eventBus } from 'src/core/event-bus';
import { createNotifier } from './engine';

export function registerNotificationListeners() {
  const { notify } = createNotifier();
  eventBus.on('notification:enqueue', async (payload) => {
    await notify(payload);
  });
}
