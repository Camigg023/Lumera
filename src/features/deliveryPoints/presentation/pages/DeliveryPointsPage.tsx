import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";
import { MapPreview } from "../components/MapPreview";
import { EligibilityCard } from "../components/EligibilityCard";
import { QRCodeCard } from "../components/QRCodeCard";
import { DeliveryPointList } from "../components/DeliveryPointList";
import { BottomNav } from "../components/BottomNav";
import { useDeliveryPoints } from "../hooks/useDeliveryPoints";
import styles from "./DeliveryPointsPage.module.css";

export function DeliveryPointsPage() {
  const {
    points,
    cycle,
    loading,
    error,
    query,
    activeFilter,
    setQuery,
    setActiveFilter,
    handleSelect,
  } = useDeliveryPoints();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <SearchBar value={query} onChange={setQuery} />
        <FilterBar active={activeFilter} onSelect={setActiveFilter} />

        {error && (
          <div className={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Bento: Map + Eligibility/QR */}
        <div className={styles.bentoGrid}>
          <div className={styles.mapCol}>
            {loading ? (
              <div className={`${styles.skeleton} ${styles.skeletonMap}`} />
            ) : (
              <MapPreview />
            )}
          </div>

          <div className={styles.sideCol}>
            {loading ? (
              <>
                <div className={`${styles.skeleton} ${styles.skeletonCard}`} />
                <div className={`${styles.skeleton} ${styles.skeletonCard}`} />
              </>
            ) : (
              <>
                {cycle && <EligibilityCard cycle={cycle} />}
                <QRCodeCard />
              </>
            )}
          </div>
        </div>

        {/* Nearby points list */}
        {loading ? (
          <div className={styles.skeleton} style={{ height: "20rem" }} />
        ) : (
          <DeliveryPointList points={points} onSelect={handleSelect} />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
