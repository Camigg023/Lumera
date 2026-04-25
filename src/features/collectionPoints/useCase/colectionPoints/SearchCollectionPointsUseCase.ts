import type { ICollectionPointRepository } from '../../../../domain/repositories/ICollectionPointRepository';
import type { CollectionPoint } from '../../../../domain/entities/CollectionPoint';

export class SearchCollectionPointsUseCase {
  constructor(private readonly repository: ICollectionPointRepository) {}

  async execute(query: string): Promise<CollectionPoint[]> {
    if (!query.trim()) return this.repository.getAll();
    return this.repository.searchByQuery(query);
  }
}
