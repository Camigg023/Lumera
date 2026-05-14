import type { LegalMetadata } from "../entities/LegalMetadata";
import type { LegalRepository } from "../repositories/LegalRepository";

export class GetLegalMetadata {
  constructor(private readonly repository: LegalRepository) {}

  async execute(): Promise<LegalMetadata> {
    return this.repository.getLegalMetadata();
  }
}
