export type CollectionPointStatus = 'active' | 'high_demand' | 'inactive';

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  district: string;
  distanceMiles: number;
  status: CollectionPointStatus;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPosition?: {
    top: string;
    left: string;
  };
}

export interface CollectionPointFilter {
  type: 'nearby' | 'high_demand' | 'recently_added';
  label: string;
  icon: string;
}

export interface RegionStats {
  impactRadiusPercent: number;
  activeCouriers: number;
  peakHoursLabel: string;
  peakCapacityPercent: number;
}
