export interface TermRule {
  id: string;
  title: string;
  description: string;
}

export interface TermSection {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  description: string;
  rules?: TermRule[];
  variant: 'default' | 'accent' | 'highlight' | 'liability' | 'company';
  icon: string;
}

export interface UserAgreement {
  userId: string;
  acceptedAt: Date | null;
  version: string;
  hasAccepted: boolean;
}

export interface TermsDocument {
  version: string;
  updatedAt: string;
  sections: TermSection[];
}
