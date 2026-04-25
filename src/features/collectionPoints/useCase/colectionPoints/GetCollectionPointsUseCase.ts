// Desde usecase/GetCollectionPointsUseCase.ts
import type { ICollectionPointRepository } from '../../../../domain/repositories/ICollectionPointRepository';
//                                              ↑ sube 1 nivel desde usecase/
import type { CollectionPoint, CollectionPointFilter } from '../../../../domain/entities/CollectionPoint';

export class GetCollectionPointsUseCase {
  constructor(private readonly repository: ICollectionPointRepository) {}

  async execute(filter?: CollectionPointFilter['type']): Promise<CollectionPoint[]> {
    if (filter) {
      return this.repository.getByFilter(filter);
    }
    return this.repository.getAll();
  }
}
