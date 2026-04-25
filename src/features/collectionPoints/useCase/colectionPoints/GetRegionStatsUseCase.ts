import type { ICollectionPointRepository } from '../../../../domain/repositories/ICollectionPointRepository';
import type { RegionStats } from '../../../../domain/entities/CollectionPoint';

export class GetRegionStatsUseCase {
  constructor(private readonly repository: ICollectionPointRepository) {}

  async execute(): Promise<RegionStats> {
    return this.repository.getRegionStats();
  }
}
