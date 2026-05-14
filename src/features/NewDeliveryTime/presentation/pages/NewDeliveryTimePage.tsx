import { Header } from "../components/Header";
import { DeliveryHeader } from "../components/DeliveryHeader";
import { CycleProgress } from "../components/CycleProgress";
import { DeliveryProgressCard } from "../components/DeliveryProgressCard";
import { EligibilityInfo } from "../components/EligibilityInfo";
import { DonationCard } from "../components/DonationCard";
import { useDeliveryTracking } from "../hooks/useDeliveryTracking";
import styles from "./NewDeliveryTimePage.module.css";

export function NewDeliveryTimePage() {
  const { delivery, loading, error } = useDeliveryTracking("LUM-89240-X");

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {loading ? (
          <>
            <div className={`${styles.skeleton} ${styles.skeletonCard}`} />
            <div className={`${styles.skeleton} ${styles.skeletonBig}`} />
          </>
        ) : error ? (
          <div className={styles.errorBox}>
            <strong>Error loading delivery:</strong> {error}
          </div>
        ) : delivery ? (
          <>
            <DeliveryHeader
              nextWindowDate={delivery.eligibilityCycle.nextWindowDate}
            />

            <div className={styles.bentoGrid}>
              <CycleProgress cycle={delivery.eligibilityCycle} />
              <DeliveryProgressCard delivery={delivery} />
            </div>

            <div className={styles.bottomSection}>
              <EligibilityInfo />
              <DonationCard />
            </div>
          </>
        ) : null}
      </main>

    </div>
  );
}
