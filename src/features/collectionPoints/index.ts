// src/features/collectionPoints/index.ts

// ── Domain ───────────────────────────────────────────────────────────────────
export type { ICollectionPointRepository } from './domain';

// ── Use Cases ────────────────────────────────────────────────────────────────
export { GetCollectionPointsUseCase }    from './useCase/colectionPoints';
export { SearchCollectionPointsUseCase } from './useCase/colectionPoints';
export { GetRegionStatsUseCase }         from './useCase/colectionPoints';

// ── Presentation: Hook ───────────────────────────────────────────────────────
export { useCollectionPoints } from './presentation/hooks/useCollectionPoints';

// ── Presentation: Components ─────────────────────────────────────────────────
export {
  TopBar,
  FilterChips,
  SearchInput,
  CollectionPointCard,
  MapView,
  StatsPanel,
} from './presentation/components';

// ── Presentation: Page ───────────────────────────────────────────────────────
export { CollectionPointsPage } from './presentation/pages/collectionPointsPage/collectionPointsPage';