// Domain
export type { LegalSection } from "./domain/entities/LegalSection";
export type { LegalItem } from "./domain/entities/LegalItem";
export type { ComplianceRule } from "./domain/entities/ComplianceRule";
export type { LegalMetadata } from "./domain/entities/LegalMetadata";
export type { LegalRepository } from "./domain/repositories/LegalRepository";
export { GetLegalSections } from "./domain/usecases/getLegalSections";
export { GetComplianceRules } from "./domain/usecases/getComplianceRules";
export { GetLegalMetadata } from "./domain/usecases/getLegalMetadata";

// Data
export { LegalDatasource } from "./data/datasources/LegalDatasource";
export { LegalRepositoryImpl } from "./data/repositories/LegalRepositoryImpl";

// Presentation
export { LegalTermsCompanyPage } from "./presentation/pages/LegalTermsCompanyPage";
export { useLegalTerms } from "./presentation/hooks/useLegalTerms";
