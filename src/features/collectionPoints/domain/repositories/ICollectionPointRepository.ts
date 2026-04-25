import type { CollectionPoint, CollectionPointFilter, RegionStats } from '../../../../domain/entities/CollectionPoint';

export interface ICollectionPointRepository {
  getAll(): Promise<CollectionPoint[]>;
  getByFilter(filter: CollectionPointFilter['type']): Promise<CollectionPoint[]>;
  searchByQuery(query: string): Promise<CollectionPoint[]>;
  getRegionStats(): Promise<RegionStats>;
}
