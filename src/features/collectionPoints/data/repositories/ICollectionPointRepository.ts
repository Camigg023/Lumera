import { ICollectionPointRepository } from "../../domain";
import { CollectionPoint, CollectionPointFilter, RegionStats } from "../../domain/entities/colecctionPoints";
import { mockCollectionPoints, mockRegionStats } from "../datasource/CollectionPointDataSource";

export class CollectionPointRepository implements ICollectionPointRepository {
  async getAll(): Promise<CollectionPoint[]> {
    // Replace with real API call: return fetch('/api/collection-points').then(r => r.json())
    return Promise.resolve(mockCollectionPoints);
  }

  async getByFilter(filter: CollectionPointFilter['type']): Promise<CollectionPoint[]> {
    const all = await this.getAll();
    switch (filter) {
      case 'nearby':
        return all.slice().sort((a, b) => a.distanceMiles - b.distanceMiles);
      case 'high_demand':
        return all.filter((p) => p.status === 'high_demand');
      case 'recently_added':
        return all;
      default:
        return all;
    }
  }

  async searchByQuery(query: string): Promise<CollectionPoint[]> {
    const all = await this.getAll();
    const q = query.toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
    );
  }

  async getRegionStats(): Promise<RegionStats> {
    return Promise.resolve(mockRegionStats);
  }
}
