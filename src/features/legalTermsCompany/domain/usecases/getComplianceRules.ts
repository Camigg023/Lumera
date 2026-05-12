import type { ComplianceRule } from "../entities/ComplianceRule";
import type { LegalRepository } from "../repositories/LegalRepository";

export class GetComplianceRules {
  constructor(private readonly repository: LegalRepository) {}

  async execute(): Promise<ComplianceRule[]> {
    return this.repository.getComplianceRules();
  }
}
