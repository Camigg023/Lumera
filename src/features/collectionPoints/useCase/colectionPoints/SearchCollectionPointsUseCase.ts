import { ICollectionPointRepository } from "../../domain";
import { CollectionPoint } from "../../domain/entities/colecctionPoints";

export class SearchCollectionPointsUseCase {
  constructor(private readonly repository: ICollectionPointRepository) {}

  async execute(query: string): Promise<CollectionPoint[]> {
    if (!query.trim()) return this.repository.getAll();
    return this.repository.searchByQuery(query);
  }
}
