import { ProfileRepository } from '../../domain/repositories/ProfileRepository';
import { ProfileDataSource } from '../datasources/ProfileDataSource';
import { Profile } from '../../domain/entities/Profile';

export class ProfileRepositoryImpl implements ProfileRepository {
  private dataSource: ProfileDataSource;

  constructor(dataSource: ProfileDataSource) {
    this.dataSource = dataSource;
  }

  getProfile(uid: string): Promise<Profile> {
    return this.dataSource.getProfile(uid);
  }

  updateProfile(uid: string, updates: Partial<Profile>): Promise<Profile> {
    return this.dataSource.updateProfile(uid, updates);
  }
}