import { useMemo, useState, useEffect } from 'react';
import { ActivityDataSource } from '../../data/datasources/ActivityDataSource';
import { ActivityRepositoryImpl } from '../../data/repositories/ActivityRepositoryImpl';
import { GetUserActivities } from '../../domain/usecases/GetUserActivities';
import { Activity } from '../../domain/entities/Activity';

export const useActivity = (userId: string) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getUserActivitiesUseCase } = useMemo(() => {
    const ds = new ActivityDataSource();
    const repo = new ActivityRepositoryImpl(ds);
    return {
      getUserActivitiesUseCase: new GetUserActivities(repo),
    };
  }, []);

  const loadActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserActivitiesUseCase.execute(userId);
      setActivities(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadActivities();
    }
  }, [userId]);

  return { activities, isLoading, error, reloadActivities: loadActivities };
};