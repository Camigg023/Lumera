import { Activity } from '../entities/Activity';

export interface ActivityRepository {
  getActivitiesByUser(userId: string): Promise<Activity[]>;
  logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity>;
}