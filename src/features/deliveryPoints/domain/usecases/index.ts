import type { DeliveryPointRepository } from "../repositories/DeliveryPointRepository";
import type { DeliveryPoint, EligibilityCycle } from "../entities";

export class GetNearbyDeliveryPoints {
  constructor(private repo: DeliveryPointRepository) {}
  async execute(query?: string): Promise<DeliveryPoint[]> {
    return this.repo.getNearbyDeliveryPoints(query);
  }
}

export class SelectDeliveryPoint {
  constructor(private repo: DeliveryPointRepository) {}
  async execute(id: string): Promise<void> {
    return this.repo.selectDeliveryPoint(id);
  }
}

export class GetPointAvailability {
  constructor(private repo: DeliveryPointRepository) {}
  async execute(id: string): Promise<DeliveryPoint> {
    return this.repo.getPointAvailability(id);
  }
}

export class GetEligibilityCycle {
  constructor(private repo: DeliveryPointRepository) {}
  async execute(): Promise<EligibilityCycle> {
    return this.repo.getEligibilityCycle();
  }
}
