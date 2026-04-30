import { CollectionPoint, RegionStats } from "../../domain/entities/colecctionPoints";


export const mockCollectionPoints: CollectionPoint[] = [
  {
    id: 'cp-001',
    name: 'Centro Comunitario Central',
    address: 'Calle 42 #51-10',
    district: 'Distrito Centro',
    distanceMiles: 0.8,
    status: 'active',
    coordinates: { lat: 6.244, lng: -75.5812 },
    mapPosition: { top: '40%', left: '30%' },
  },
  {
    id: 'cp-002',
    name: 'Despensa del Norte',
    address: 'Carrera 45 #80-15',
    district: 'Zona Norte',
    distanceMiles: 2.4,
    status: 'high_demand',
    coordinates: { lat: 6.265, lng: -75.568 },
    mapPosition: { top: '25%', left: '65%' },
  },
  {
    id: 'cp-003',
    name: 'Bodega Puerta Este',
    address: 'Calle 30 #22-44',
    district: 'Sector Industrial',
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
