import { ICollectionPointRepository } from "../../domain";
import { CollectionPoint, CollectionPointFilter } from "../../domain/entities/colecctionPoints";

export class GetCollectionPointsUseCase {
  constructor(private readonly repository: ICollectionPointRepository) {}

  async execute(filter?: CollectionPointFilter['type']): Promise<CollectionPoint[]> {
    if (filter) {
      return this.repository.getByFilter(filter);
    }
    return this.repository.getAll();
  }
}
