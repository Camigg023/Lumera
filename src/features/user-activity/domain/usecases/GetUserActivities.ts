import { ActivityRepository } from '../repositories/ActivityRepository';
import { Activity } from '../entities/Activity';

export class GetUserActivities {
  constructor(private repository: ActivityRepository) {}

  async execute(userId: string): Promise<Activity[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.repository.getActivitiesByUser(userId);
  }
}