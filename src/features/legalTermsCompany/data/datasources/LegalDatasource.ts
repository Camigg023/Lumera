import type { ComplianceRule } from "../../domain/entities/ComplianceRule";
import type { LegalMetadata } from "../../domain/entities/LegalMetadata";
import type { LegalSection } from "../../domain/entities/LegalSection";

export class LegalDatasource {
  async fetchLegalSections(): Promise<LegalSection[]> {
    return [
      {
        id: "sec-1",
        anchor: "introduction",
        title: "1. Introduction",
        content: [
          'Welcome to Lumera. These Terms of Service ("Terms") govern your access to and use of Lumera\'s platform designed for corporate food redistribution. By creating a corporate account, you represent that you have the authority to bind your organization to these Terms.',
          "Lumera serves as a facilitator between food surplus providers (your company) and verified community partners. Our mission is to ensure safe, dignified, and efficient food recovery.",
        ],
      },
      {
        id: "sec-2",
        anchor: "compliance",
        title: "2. Food Safety & Compliance",
        content: [],
        isHighlighted: true,
        items: [
          'All food must be within its "Best Before" or "Use By" dates at the time of listing.',
          "Maintain consistent temperature logs for perishable items.",
          "Provide accurate labeling including common allergens (milk, eggs, nuts, wheat, soy, fish, shellfish).",
          "Immediate reporting of any contamination concerns.",
        ],
      },
      {
        id: "sec-3",
        anchor: "liability",
        title: "3. Liability & Indemnity",
        content: [
          'Lumera provides the platform "as is." While we facilitate the connection, the physical transfer of goods is a direct interaction between your organization and the recipient.',
          "However, your organization agrees to indemnify Lumera against any claims resulting from gross negligence or intentional misconduct in the preparation or storage of donated goods.",
        ],
        quote:
          "The Good Samaritan Food Donation Act provides legal protection to donors of food and grocery products to non-profit organizations for distribution to individuals in need. Organizations are protected from civil and criminal liability should the product donated in good faith cause harm.",
      },
      {
        id: "sec-4",
        anchor: "data",
        title: "4. Data Management & Metrics",
        content: [
          "Lumera tracks impact metrics including weight of food saved and CO2 emissions averted. You grant Lumera the right to use anonymized data for platform-wide impact reports.",
          "You are responsible for maintaining the confidentiality of your corporate login credentials. Any activity under your account is the responsibility of the organization.",
        ],
      },
      {
        id: "sec-5",
        anchor: "termination",
        title: "5. Termination",
        content: [
          "Lumera reserves the right to suspend or terminate access to the platform for any organization that fails to meet safety standards or violates community guidelines. We provide a 30-day notice period for standard terminations.",
        ],
      },
    ];
  }

  async fetchComplianceRules(): Promise<ComplianceRule[]> {
    return [
      {
        id: "rule-1",
        rule: 'All food must be within its "Best Before" or "Use By" dates at the time of listing.',
        mandatory: true,
      },
      {
        id: "rule-2",
        rule: "Maintain consistent temperature logs for perishable items.",
        mandatory: true,
      },
      {
        id: "rule-3",
        rule: "Provide accurate labeling including common allergens (milk, eggs, nuts, wheat, soy, fish, shellfish).",
        mandatory: true,
      },
      {
        id: "rule-4",
        rule: "Immediate reporting of any contamination concerns.",
        mandatory: true,
      },
    ];
  }

  async fetchLegalMetadata(): Promise<LegalMetadata> {
    return {
      lastUpdated: "October 24, 2023",
      version: "1.0.0",
      effectiveDate: "November 1, 2023",
    };
  }
}
