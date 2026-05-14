import type { ComplianceRule } from "../entities/ComplianceRule";
import type { LegalMetadata } from "../entities/LegalMetadata";
import type { LegalSection } from "../entities/LegalSection";

export interface LegalRepository {
  getLegalSections(): Promise<LegalSection[]>;
  getComplianceRules(): Promise<ComplianceRule[]>;
  getLegalMetadata(): Promise<LegalMetadata>;
}
