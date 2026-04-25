import type { CollectionPoint, RegionStats } from '../../../../domain/entities/CollectionPoint';

export const mockCollectionPoints: CollectionPoint[] = [
  {
    id: 'cp-001',
    name: 'Central Community Hub',
    address: '421 Pine St',
    district: 'Downtown District',
    distanceMiles: 0.8,
    status: 'active',
    coordinates: { lat: 6.244, lng: -75.5812 },
    mapPosition: { top: '40%', left: '30%' },
  },
  {
    id: 'cp-002',
    name: 'Northside Pantry',
    address: '1592 Maple Ave',
    district: 'North Side',
    distanceMiles: 2.4,
    status: 'high_demand',
    coordinates: { lat: 6.265, lng: -75.568 },
    mapPosition: { top: '25%', left: '65%' },
  },
  {
    id: 'cp-003',
    name: 'East Gate Storage',
    address: '88 Industrial Way',
    district: 'Sector 7',
    distanceMiles: 4.1,
    status: 'inactive',
    coordinates: { lat: 6.231, lng: -75.551 },
    mapPosition: { top: '70%', left: '55%' },
  },
];

export const mockRegionStats: RegionStats = {
  impactRadiusPercent: 92,
  activeCouriers: 24,
  peakHoursLabel: '10:00 AM - 2:00 PM',
  peakCapacityPercent: 85,
};
