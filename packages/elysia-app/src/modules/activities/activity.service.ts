import { ActivityRepository } from './infrastructure/activity.repository';
import {
  QueryActivity,
  NewActivity,
  UpdateActivity,
  ActivityTypeEnum,
  ACTIVITY_TYPE,
} from './infrastructure/activity.entity';
import { BaseService } from '../../shared/types/base/base.service';
import { eventBus } from '../../core/event-bus';
import { AppError } from '../../shared/Errors/AppError';

export class ActivityService extends BaseService {
  constructor(private activityRepository: ActivityRepository) {
    super();
  }

  async findManyWithPagination(query: QueryActivity) {
    return await this.activityRepository.findManyWithPagination(query);
  }

  async findOne(id: string) {
    const activity = await this.activityRepository.findOne({
      where: [{ column: 'id', operator: '=', value: id }],
    });

    if (!activity) {
      throw new AppError({
        error: 'activity_not_found',
        statusCode: 404,
      });
    }

    return activity;
  }

  async create(data: Omit<NewActivity, 'earned_xp' | 'earned_at'>) {
    // Calculate XP based on activity type
    const earnedXp = ACTIVITY_TYPE[data.type];

    const activityData: NewActivity = {
      ...data,
      earned_xp: earnedXp,
      created_at: new Date(),
    };

    const activity = await this.activityRepository.create(activityData);

    // Emit event for further processing (leaderboards, achievements, etc.)
    eventBus.emit('activity:created', { activity });

    return activity;
  }

  async update(id: string, data: UpdateActivity) {
    const existingActivity = await this.findOne(id);
    const activity = await this.activityRepository.update(id, data);

    if (!activity) {
      throw new AppError({
        error: 'activity_update_failed',
        statusCode: 400,
      });
    }

    eventBus.emit('activity:updated', {
      oldActivity: existingActivity,
      newActivity: activity,
    });

    return activity;
  }

  async delete(id: string) {
    await this.findOne(id); // Ensure activity exists
    await this.activityRepository.deleteOne({
      where: [{ column: 'id', operator: '=', value: id }],
    });

    eventBus.emit('activity:deleted', { activityId: id });
  }

  async findByUserId(userId: string) {
    return await this.activityRepository.findByUserId(userId);
  }

  async findByUserIdAndType(userId: string, type: ActivityTypeEnum) {
    return await this.activityRepository.findByUserIdAndType(userId, type);
  }

  async getUserTotalXp(userId: string): Promise<number> {
    return await this.activityRepository.getTotalXpByUserId(userId);
  }

  async getUserXpInDateRange(userId: string, startDate: Date, endDate: Date): Promise<number> {
    return await this.activityRepository.getXpByUserIdAndDateRange(userId, startDate, endDate);
  }

  async getDailyXp(userId: string, date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.getUserXpInDateRange(userId, startOfDay, endOfDay);
  }

  async getWeeklyXp(userId: string, date: Date): Promise<number> {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return await this.getUserXpInDateRange(userId, startOfWeek, endOfWeek);
  }

  async getMonthlyXp(userId: string, date: Date): Promise<number> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return await this.getUserXpInDateRange(userId, startOfMonth, endOfMonth);
  }

  /**
   * Award XP for completing an activity
   */
  async awardXp(userId: string, type: ActivityTypeEnum) {
    const activity = await this.create({
      user_id: userId,
      type,
    });

    return {
      activity,
      earnedXp: activity.earned_xp,
      totalXp: await this.getUserTotalXp(userId),
    };
  }

  /**
   * Check if user has already earned XP for a specific activity today
   * Useful for activities like DAILY_LOGIN that should only be awarded once per day
   */
  async hasEarnedTodayForType(userId: string, type: ActivityTypeEnum): Promise<boolean> {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const activities = await this.activityRepository.findByUserIdAndType(userId, type);

    return activities.some((activity) => {
      const activityDate = new Date(activity.created_at);
      return activityDate >= startOfDay && activityDate <= endOfDay;
    });
  }
}
