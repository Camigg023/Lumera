import type { ComplianceRule } from "../../domain/entities/ComplianceRule";
import type { LegalMetadata } from "../../domain/entities/LegalMetadata";
import type { LegalSection } from "../../domain/entities/LegalSection";
import type { LegalRepository } from "../../domain/repositories/LegalRepository";
import { LegalDatasource } from "../datasources/LegalDatasource";

export class LegalRepositoryImpl implements LegalRepository {
  private readonly datasource: LegalDatasource;

  constructor() {
    this.datasource = new LegalDatasource();
  }

  async getLegalSections(): Promise<LegalSection[]> {
    return this.datasource.fetchLegalSections();
  }

  async getComplianceRules(): Promise<ComplianceRule[]> {
    return this.datasource.fetchComplianceRules();
  }

  async getLegalMetadata(): Promise<LegalMetadata> {
    return this.datasource.fetchLegalMetadata();
  }
}
