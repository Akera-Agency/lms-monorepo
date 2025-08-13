import { app } from 'src/app';
import { Logger } from 'src/shared/logger/logger';
import { UserEntity } from './infrastructure/user.entity';
export type UserUpdatedEvent = {
  newUser: UserEntity;
  oldUser: UserEntity;
};

app.eventBus.on('user:updated', async (u: UserUpdatedEvent) => {
  Logger.info(`Event user:updated -> ${u.newUser.id}`);
});
