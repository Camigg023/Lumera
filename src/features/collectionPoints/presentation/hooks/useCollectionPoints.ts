import { useState, useEffect, useCallback } from 'react';

// hooks/ → presentation/ → collectionPoints/ → features/ → src/ → domain
import type { CollectionPoint, CollectionPointFilter, RegionStats }
  from '../../domain/entities/colecctionPoints';

// hooks/ → presentation/ → collectionPoints/ → data/
import { CollectionPointRepository }
  from '../../data/repositories/ICollectionPointRepository';

// hooks/ → presentation/ → collectionPoints/ → useCase/
import { GetCollectionPointsUseCase, SearchCollectionPointsUseCase, GetRegionStatsUseCase }
  from '../../useCase/colectionPoints';

// resto del archivo igual...
const repository = new CollectionPointRepository();
const getCollectionPoints = new GetCollectionPointsUseCase(repository);
const searchCollectionPoints = new SearchCollectionPointsUseCase(repository);
const getRegionStats = new GetRegionStatsUseCase(repository);

interface UseCollectionPointsReturn {
  points: CollectionPoint[];
  stats: RegionStats | null;
  activeFilter: CollectionPointFilter['type'];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  setFilter: (filter: CollectionPointFilter['type']) => void;
  setSearchQuery: (query: string) => void;
}

export function useCollectionPoints(): UseCollectionPointsReturn {
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [stats, setStats] = useState<RegionStats | null>(null);
  const [activeFilter, setActiveFilter] = useState<CollectionPointFilter['type']>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPoints = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = searchQuery.trim()
        ? await searchCollectionPoints.execute(searchQuery)
        : await getCollectionPoints.execute(activeFilter);
      setPoints(data);
    } catch (err) {
      setError('Failed to load collection points. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, searchQuery]);

  const loadStats = useCallback(async () => {
    try {
      const data = await getRegionStats.execute();
      setStats(data);
    } catch {
      // Stats are non-critical; fail silently
    }
  }, []);

  useEffect(() => {
    void loadPoints();
  }, [loadPoints]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const setFilter = useCallback((filter: CollectionPointFilter['type']) => {
    setActiveFilter(filter);
    setSearchQuery('');
  }, []);

  return { points, stats, activeFilter, searchQuery, isLoading, error, setFilter, setSearchQuery };
}