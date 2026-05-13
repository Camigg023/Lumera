import { ProfileRepository } from '../repositories/ProfileRepository';
import { Profile } from '../entities/Profile';

export class UpdateProfile {
  constructor(private repository: ProfileRepository) {}

  async execute(uid: string, updates: Partial<Profile>): Promise<Profile> {
    if (!uid) {
      throw new Error('User ID is required');
    }
    return this.repository.updateProfile(uid, updates);
  }
}