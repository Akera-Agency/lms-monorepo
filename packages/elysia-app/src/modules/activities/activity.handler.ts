import { app } from 'src/app';
import { Activity } from './infrastructure/activity.entity';

export type ActivityCreatedEvent = { activity: Activity };
export type ActivityUpdatedEvent = {
  oldActivity: Activity;
  newActivity: Activity;
};
export type ActivityDeletedEvent = { activityId: string };

export const activityHandler = {
  onActivityCreated: (payload: ActivityCreatedEvent) => {
    try {
      console.log('Activity created:', payload);
    } catch (error) {
      throw new EvalError(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  },
  onActivityUpdated: (payload: ActivityUpdatedEvent) => {
    try {
      console.log('Activity updated:', payload);
    } catch (error) {
      throw new EvalError(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  },
  onActivityDeleted: (payload: ActivityDeletedEvent) => {
    try {
      console.log('Activity deleted:', payload);
    } catch (error) {
      throw new EvalError(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  },
};

app.eventBus.on('activity:created', activityHandler.onActivityCreated);
app.eventBus.on('activity:updated', activityHandler.onActivityUpdated);
app.eventBus.on('activity:deleted', activityHandler.onActivityDeleted);
