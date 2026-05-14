import type { DeliveryRepository } from "../repositories/DeliveryRepository";
import type { Delivery, DeliveryStep, EligibilityCycle } from "../entities";

export class GetDeliveryStatus {
  constructor(private repository: DeliveryRepository) {}

  async execute(trackingNumber: string): Promise<Delivery> {
    return this.repository.getDeliveryStatus(trackingNumber);
  }
}

export class GetDeliveryTimeline {
  constructor(private repository: DeliveryRepository) {}

  async execute(trackingNumber: string): Promise<DeliveryStep[]> {
    return this.repository.getDeliveryTimeline(trackingNumber);
  }
}

export class GetEligibilityCycle {
  constructor(private repository: DeliveryRepository) {}

  async execute(): Promise<EligibilityCycle> {
    return this.repository.getEligibilityCycle();
  }
}
