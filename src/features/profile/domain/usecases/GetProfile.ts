import { ProfileRepository } from '../repositories/ProfileRepository';
import { Profile } from '../entities/Profile';

export class GetProfile {
  constructor(private repository: ProfileRepository) {}

  async execute(uid: string): Promise<Profile> {
    if (!uid) {
      throw new Error('User ID is required');
    }
    return this.repository.getProfile(uid);
  }
}