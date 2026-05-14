

//domain
export * from './domain/entities/TermSection';
export * from './domain/repositories/TermsRepository';
export * from './domain/usecases/AcceptTerms';
export * from './domain/usecases/GetTerms';


//data
export * from './data/datasources/TermsDatasource';
export * from './data/repositories/TermsRepositoryImpl';

//presentation
export * from './presentation/components/AcceptanceSection';
export * from './presentation/components/BottomNav';
export * from './presentation/components/CompanyDonationCard';
export *from './presentation/components/CoreValuesCard';
export * from './presentation/components/Header';
export * from './presentation/components/HeroSection';
export * from './presentation/components/RulesGrid';
export * from './presentation/components/TransparencyCard';
export * from './presentation/components/FairUsageCard';
export * from './presentation/components/FoodIntegritySection';


//hooks and pages
export * from './presentation/hooks/useTerms';
export * from './presentation/pages/TermsPage'; 

