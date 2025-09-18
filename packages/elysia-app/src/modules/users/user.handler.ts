import { app } from 'src/app';
import { Logger } from 'src/shared/logger/logger';
import { UserEntity } from './infrastructure/user.entity';
export type UserUpdatedEvent = {
  newUser: UserEntity;
  oldUser: UserEntity;
};

export const userHandler = {
  onUserUpdated: (payload: UserUpdatedEvent) => {
    try {
      Logger.info(`Event user:updated -> ${payload.newUser.id}`);
    } catch (error) {
      throw new EvalError(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  },
};

app.eventBus.on('user:updated', userHandler.onUserUpdated);
