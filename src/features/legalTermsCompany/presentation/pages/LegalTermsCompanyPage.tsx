import { BottomNav } from "../components/BottomNav/BottomNav";
import { LegalContent } from "../components/LegalContent/LegalContent";
import { LegalHeader } from "../components/LegalHeader/LegalHeader";
import { Navbar } from "../components/Navbar/Navbar";
import { SidebarNavigation } from "../components/SidebarNavigation/SidebarNavigation";
import { useLegalTerms } from "../hooks/useLegalTerms";
import styles from "./LegalTermsCompanyPage.module.css";

const NAV_ITEMS = [
  { anchor: "introduction", label: "Introduction" },
  { anchor: "compliance", label: "Food Compliance" },
  { anchor: "liability", label: "Liability & Indemnity" },
  { anchor: "data", label: "Data Privacy" },
  { anchor: "termination", label: "Account Termination" },
];

export function LegalTermsCompanyPage() {
  const {
    sections,
    metadata,
    isLoading,
    error,
    accepted,
    setAccepted,
    activeSection,
    setActiveSection,
  } = useLegalTerms();

  const handleAccept = () => {
    if (accepted) {
      alert("Terms accepted! Welcome to Lumera.");
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <LegalHeader />

        <div className={styles.grid}>
          <SidebarNavigation
            items={NAV_ITEMS}
            activeSection={activeSection}
            onSectionClick={setActiveSection}
            metadata={metadata}
          />

          <div className={styles.content}>
            {isLoading && (
              <div className={styles.loading}>Loading legal terms...</div>
            )}
            {error && (
              <div className={styles.error}>Error loading content: {error}</div>
            )}
            {!isLoading && !error && (
              <LegalContent
                sections={sections}
                accepted={accepted}
                onAcceptChange={setAccepted}
                onAccept={handleAccept}
              />
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
