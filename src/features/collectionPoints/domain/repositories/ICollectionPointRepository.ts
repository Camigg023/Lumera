import { CollectionPoint, CollectionPointFilter, RegionStats } from "../entities/colecctionPoints";


export interface ICollectionPointRepository {
  getAll(): Promise<CollectionPoint[]>;
  getByFilter(filter: CollectionPointFilter['type']): Promise<CollectionPoint[]>;
  searchByQuery(query: string): Promise<CollectionPoint[]>;
  getRegionStats(): Promise<RegionStats>;
}
