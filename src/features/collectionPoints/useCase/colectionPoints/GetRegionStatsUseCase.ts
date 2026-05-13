import { ICollectionPointRepository } from "../../domain";
import { RegionStats } from "../../domain/entities/colecctionPoints";

export class GetRegionStatsUseCase {
  constructor(private readonly repository: ICollectionPointRepository) {}

  async execute(): Promise<RegionStats> {
    return this.repository.getRegionStats();
  }
}
