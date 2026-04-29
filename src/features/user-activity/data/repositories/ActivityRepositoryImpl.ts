import { ActivityRepository } from '../../domain/repositories/ActivityRepository';
import { ActivityDataSource } from '../datasources/ActivityDataSource';
import { Activity } from '../../domain/entities/Activity';

export class ActivityRepositoryImpl implements ActivityRepository {
  private dataSource: ActivityDataSource;

  constructor(dataSource: ActivityDataSource) {
    this.dataSource = dataSource;
  }

  getActivitiesByUser(userId: string): Promise<Activity[]> {
    return this.dataSource.getActivitiesByUser(userId);
  }

  logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
    return this.dataSource.logActivity(activity);
  }
}