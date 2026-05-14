import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { SummaryCards } from "../components/SummaryCards";
import { CategoryAccordion } from "../components/CategoryAccordion";
import { SmartAllocationPanel } from "../components/SmartAllocationPanel";
import { PickupPanel } from "../components/PickupPanel";
import { ActionButtons } from "../components/ActionButtons";
import { BottomNav } from "../components/BottomNav";
import { HelpButton } from "../components/HelpButton";
import { useMiniMarket } from "../hooks/useMiniMarket";
import styles from "./MiniMarketPage.module.css";

export function MiniMarketPage() {
  const { pkg, loading, error } = useMiniMarket();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {loading ? (
          <>
            <div className={`${styles.skeleton} ${styles.skeletonHero}`} style={{ marginBottom: "2.5rem" }} />
            <div className={styles.grid}>
              <div className={styles.leftCol}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`${styles.skeleton} ${styles.skeletonCard}`} />
                ))}
              </div>
              <div className={styles.rightCol}>
                <div className={`${styles.skeleton}`} style={{ height: "16rem" }} />
                <div className={`${styles.skeleton}`} style={{ height: "12rem" }} />
              </div>
            </div>
          </>
        ) : error ? (
          <div className={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        ) : pkg ? (
          <>
            <HeroSection allocation={pkg.allocation} />

            <div className={styles.grid}>
              {/* Left column — breakdown */}
              <div className={styles.leftCol}>
                <SummaryCards />
                <div className={styles.categoryList}>
                  {pkg.categories.map((cat) => (
                    <CategoryAccordion key={cat.id} category={cat} />
                  ))}
                </div>
              </div>

              {/* Right column — panels */}
              <div className={styles.rightCol}>
                <SmartAllocationPanel />
                <PickupPanel pickup={pkg.pickupInfo} />
              </div>
            </div>

            <ActionButtons />
          </>
        ) : null}
      </main>

      <BottomNav />
      <HelpButton />
    </div>
  );
}
