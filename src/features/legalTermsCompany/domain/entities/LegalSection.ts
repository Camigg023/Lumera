export interface LegalSection {
  id: string;
  anchor: string;
  title: string;
  content: string[];
  quote?: string;
  items?: string[];
  isHighlighted?: boolean;
}
