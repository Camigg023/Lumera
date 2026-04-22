import { Profile } from '../entities/Profile';

export interface ProfileRepository {
  getProfile(uid: string): Promise<Profile>;
  updateProfile(uid: string, updates: Partial<Profile>): Promise<Profile>;
}