import type { LegalSection } from "../entities/LegalSection";
import type { LegalRepository } from "../repositories/LegalRepository";

export class GetLegalSections {
  constructor(private readonly repository: LegalRepository) {}

  async execute(): Promise<LegalSection[]> {
    return this.repository.getLegalSections();
  }
}
