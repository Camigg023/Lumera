import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { CoreValuesCard } from '../components/CoreValuesCard';
import { RulesGrid } from '../components/RulesGrid';
import { TransparencyCard } from '../components/TransparencyCard';
import { CompanyDonationCard } from '../components/CompanyDonationCard';
import { AcceptanceSection } from '../components/AcceptanceSection';
import { BottomNav } from '../components/BottomNav';
import { useTerms } from '../hooks/useTerms';
import styles from './TermsPage.module.css';

export function TermsPage() {
  const { terms, agreement, isLoading, isAccepting, error, acceptTerms, downloadPdf } =
    useTerms();

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">
          progress_activity
        </span>
        <p className={styles.loadingText}>Loading community agreement…</p>
      </div>
    );
  }

  if (error || !terms) {
    return (
      <div className={styles.errorWrapper}>
        <span className="material-symbols-outlined text-4xl text-error">error</span>
        <p className={styles.errorText}>{error ?? 'Something went wrong.'}</p>
      </div>
    );
  }

  const respectSection = terms.sections.find((s) => s.id === 'respect-dignity')!;
  const foodSection = terms.sections.find((s) => s.id === 'food-integrity')!;
  const fairUsageSection = terms.sections.find((s) => s.id === 'fair-usage')!;
  const liabilitySection = terms.sections.find((s) => s.id === 'shared-liability')!;
  const companySection = terms.sections.find((s) => s.id === 'company-donation')!;

  return (
    <>
      {/* Background decorative blobs */}
      <div className={styles.blobTopRight} />
      <div className={styles.blobBottomLeft} />

      <Header />

      <main className={styles.main}>
        <HeroSection />

        <div className={styles.grid}>
          <CoreValuesCard section={respectSection} />
          <RulesGrid foodSection={foodSection} fairUsageSection={fairUsageSection} />
          <TransparencyCard section={liabilitySection} document={terms} />
          <CompanyDonationCard section={companySection} />
          <AcceptanceSection
            agreement={agreement}
            isAccepting={isAccepting}
            onAccept={acceptTerms}
            onDownload={downloadPdf}
          />
        </div>
      </main>

      <BottomNav />
    </>
  );
}
