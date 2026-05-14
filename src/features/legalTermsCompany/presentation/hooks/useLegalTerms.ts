import { useEffect, useState } from "react";
import { LegalRepositoryImpl } from "../../data/repositories/LegalRepositoryImpl";
import type { ComplianceRule } from "../../domain/entities/ComplianceRule";
import type { LegalMetadata } from "../../domain/entities/LegalMetadata";
import type { LegalSection } from "../../domain/entities/LegalSection";
import { GetComplianceRules } from "../../domain/usecases/getComplianceRules";
import { GetLegalMetadata } from "../../domain/usecases/getLegalMetadata";
import { GetLegalSections } from "../../domain/usecases/getLegalSections";

interface UseLegalTermsReturn {
  sections: LegalSection[];
  complianceRules: ComplianceRule[];
  metadata: LegalMetadata | null;
  isLoading: boolean;
  error: string | null;
  accepted: boolean;
  setAccepted: (value: boolean) => void;
  activeSection: string;
  setActiveSection: (anchor: string) => void;
}

const repository = new LegalRepositoryImpl();
const getLegalSections = new GetLegalSections(repository);
const getComplianceRules = new GetComplianceRules(repository);
const getLegalMetadata = new GetLegalMetadata(repository);

export function useLegalTerms(): UseLegalTermsReturn {
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [metadata, setMetadata] = useState<LegalMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [secs, rules, meta] = await Promise.all([
          getLegalSections.execute(),
          getComplianceRules.execute(),
          getLegalMetadata.execute(),
        ]);
        setSections(secs);
        setComplianceRules(rules);
        setMetadata(meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  return {
    sections,
    complianceRules,
    metadata,
    isLoading,
    error,
    accepted,
    setAccepted,
    activeSection,
    setActiveSection,
  };
}
