
import { useCollectionPoints } from '../../hooks/useCollectionPoints';
import { TopBar } from '../../components/topBar';
import { FilterChips } from '../../components/FilterChips';
import { SearchInput } from '../../components/SearchInput';
import { CollectionPointCard } from '../../components/CollectionPointCard';
import { MapView } from '../../components/MapView';
import { StatsPanel } from '../../components/StatsPanel';
import styles from './collectionPointsPage.module.css';
import { CollectionPoint } from '../../../domain/entities/colecctionPoints';

// These would come from auth context in a real app
const USER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7GZDLANwax5cFa_bIIPfvNjoaVxo5_4uUOVtOC97pP4StzVtWrccUcDLx_HrLGHxidigGjrhITK3kuIVBtR1nybmTCu3tko5LREzsn2ftfyr2G3bls51qzafI9viVKd8dNj89oaTmeS5c-rmlPNUH8pAtaLC4iyH_pnueHpfqKrND4ovXxAPZZpFAOIc5U4Zcu8Ba3GQojMkCHOHdpiaFn66Vw2ln6pYn32PL8YsEjrKFAFMPu45TZ-FBhb22CktIFSc30ujJb5xo';

export function CollectionPointsPage() {
  const { points, stats, activeFilter, searchQuery, isLoading, error, setFilter, setSearchQuery } =
    useCollectionPoints();

  const handleDirections = (point: CollectionPoint) => {
    const { lat, lng } = point.coordinates;
    window.open(`https://maps.google.com?q=${lat},${lng}`, '_blank');
  };

  const handleDetails = (point: CollectionPoint) => {
    // Navigate to detail page: navigate(`/collection-points/${point.id}`)
    console.info('Navigate to detail:', point.id);
  };

  return (
    <div className={styles.page}>
      <TopBar userAvatarUrl={USER_AVATAR} />

      <main className={styles.main}>
        {/* Two-column layout */}
        <div className={styles.layout}>
          {/* ── Left column: controls + list ── */}
          <div className={styles.sidebar}>
            <div>
              <h2 className={styles.heading}>Collection Points</h2>
              <p className={styles.subheading}>
                Find a nearby redistribution hub to deliver or claim surplus food.
              </p>
            </div>

            <FilterChips active={activeFilter} onChange={setFilter} />
            <SearchInput value={searchQuery} onChange={setSearchQuery} />

            {/* Card list */}
            <div className={styles.cardList} role="list" aria-live="polite" aria-busy={isLoading}>
              {isLoading && <p className={styles.stateMsg}>Loading points…</p>}
              {error   && <p className={styles.errorMsg}>{error}</p>}
              {!isLoading && !error && points.length === 0 && (
                <p className={styles.stateMsg}>No collection points found.</p>
              )}
              {!isLoading &&
                points.map((point) => (
                  <div key={point.id} role="listitem">
                    <CollectionPointCard
                      point={point}
                      onDirections={handleDirections}
                      onDetails={handleDetails}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* ── Right column: map ── */}
          <MapView points={points} onUpdateResults={() => setFilter(activeFilter)} />
        </div>

        {/* Stats bento */}
        {stats && <StatsPanel stats={stats} />}
      </main>

     

      {/* FAB */}
      <button className={styles.fab} aria-label="Add collection point">
        <span className="material-symbols-outlined" style={{ fontSize: 30 }}>add_location</span>
      </button>
    </div>
  );
}
