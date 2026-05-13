import { useMemo, useState, useEffect } from 'react';
import { ProfileDataSource } from '../../data/datasources/ProfileDataSource';
import { ProfileRepositoryImpl } from '../../data/repositories/ProfileRepositoryImpl';
import { GetProfile } from '../../domain/usecases/GetProfile';
import { UpdateProfile } from '../../domain/usecases/UpdateProfile';
import { Profile } from '../../domain/entities/Profile';

export const useProfile = (uid: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getProfileUseCase, updateProfileUseCase } = useMemo(() => {
    const ds = new ProfileDataSource();
    const repo = new ProfileRepositoryImpl(ds);
    return {
      getProfileUseCase: new GetProfile(repo),
      updateProfileUseCase: new UpdateProfile(repo),
    };
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProfileUseCase.execute(uid);
      setProfile(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await updateProfileUseCase.execute(uid, updates);
      setProfile(updated);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to update profile');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      loadProfile();
    }
  }, [uid]);

  return { profile, isLoading, error, updateProfile, reloadProfile: loadProfile };
};