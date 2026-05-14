import type { Delivery, DeliveryStep, EligibilityCycle } from "../entities";

export interface DeliveryRepository {
  getDeliveryStatus(trackingNumber: string): Promise<Delivery>;
  getDeliveryTimeline(trackingNumber: string): Promise<DeliveryStep[]>;
  getEligibilityCycle(): Promise<EligibilityCycle>;
}
