import { app } from 'src/app';
import { AppEvents } from 'src/core/event-bus';
import { Logger } from 'src/shared/logger/logger';

app.eventBus.on('user:updated', async (u: AppEvents['user:updated']) => {
  Logger.info(`Event user:updated -> ${u.new.id}`);
});
