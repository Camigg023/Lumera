import type { DeliveryPoint, EligibilityCycle } from "../entities";

export interface DeliveryPointRepository {
  getNearbyDeliveryPoints(query?: string): Promise<DeliveryPoint[]>;
  selectDeliveryPoint(id: string): Promise<void>;
  getPointAvailability(id: string): Promise<DeliveryPoint>;
  getEligibilityCycle(): Promise<EligibilityCycle>;
}
