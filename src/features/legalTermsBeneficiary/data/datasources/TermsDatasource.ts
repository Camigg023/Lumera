import { TermsDocument, UserAgreement } from '../../domain/entities/TermSection';

const MOCK_TERMS: TermsDocument = {
  version: '2.4',
  updatedAt: 'Sept 2023',
  sections: [
    {
      id: 'respect-dignity',
      number: 1,
      title: 'Respect & Dignity',
      subtitle: 'CORE PRINCIPLE',
      description:
        'Every interaction on Lumera should be rooted in mutual respect. We are a bridge between those with excess and those in need.',
      rules: [
        {
          id: 'rd-1',
          title: 'Kindness',
          description: 'Treat all donors and recipients with kindness and empathy.',
        },
        {
          id: 'rd-2',
          title: 'Privacy',
          description:
            'Maintain the privacy of pickup locations and individual circumstances.',
        },
      ],
      variant: 'default',
      icon: 'favorite',
    },
    {
      id: 'food-integrity',
      number: 2,
      title: 'Food Integrity',
      description:
        'Quality and safety are our highest priorities. By using Lumera, you agree to:',
      rules: [
        {
          id: 'fi-1',
          title: 'Accurate Labeling',
          description:
            'Provide clear information about ingredients and potential allergens for every listing.',
        },
        {
          id: 'fi-2',
          title: 'Freshness Standards',
          description:
            'Only share food that is safe for consumption and stored according to safety guidelines.',
        },
      ],
      variant: 'default',
      icon: 'restaurant',
    },
    {
      id: 'fair-usage',
      number: 3,
      title: 'Fair Usage',
      description:
        'Lumera is a community resource. Please only claim what you can use to ensure there is enough for everyone in our network.',
      rules: [
        {
          id: 'fu-1',
          title: 'Zero Tolerance for Resale',
          description: 'Items obtained through Lumera must never be resold.',
        },
        {
          id: 'fu-2',
          title: 'Equity over Equality',
          description:
            'Priority is given to those with greatest need in our distribution network.',
        },
      ],
      variant: 'accent',
      icon: 'balance',
    },
    {
      id: 'shared-liability',
      number: 4,
      title: 'Our Shared Liability',
      description:
        'Lumera provides the platform to connect donors and recipients. While we facilitate the connection, users accept full responsibility for the quality and safety of food exchanged through the platform.',
      variant: 'liability',
      icon: 'policy',
    },
    {
      id: 'company-donation',
      number: 5,
      title: 'Company Donation Terms',
      description: 'Special terms for corporate and organizational donors.',
      rules: [
        {
          id: 'cd-1',
          title: 'Food Quality',
          description:
            'Donated items must meet strict safety guidelines and maintain adequate shelf-life for distribution.',
        },
        {
          id: 'cd-2',
          title: 'Liability Release',
          description:
            'Lumera assumes full responsibility for redistribution logistics once items are picked up from the facility.',
        },
        {
          id: 'cd-3',
          title: 'Tax Benefits',
          description:
            'Companies receive detailed impact reports for use in corporate tax deduction documentation.',
        },
      ],
      variant: 'company',
      icon: 'business',
    },
  ],
};

const MOCK_USER_AGREEMENTS: Map<string, UserAgreement> = new Map();

export const TermsDatasource = {
  async fetchTerms(): Promise<TermsDocument> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TERMS), 500);
    });
  },

  async saveAcceptance(userId: string): Promise<UserAgreement> {
    const agreement: UserAgreement = {
      userId,
      acceptedAt: new Date(),
      version: MOCK_TERMS.version,
      hasAccepted: true,
    };
    MOCK_USER_AGREEMENTS.set(userId, agreement);
    return new Promise((resolve) => setTimeout(() => resolve(agreement), 300));
  },

  async fetchUserAgreement(userId: string): Promise<UserAgreement | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_USER_AGREEMENTS.get(userId) ?? null), 200);
    });
  },
};
