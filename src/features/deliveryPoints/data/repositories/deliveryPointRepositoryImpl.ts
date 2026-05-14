import type { DeliveryPointRepository } from "../../domain/repositories/DeliveryPointRepository";
import type { DeliveryPoint, EligibilityCycle } from "../../domain/entities";
import { DeliveryPointDatasource } from "../datasources/DeliveryPointDatasource";

export class DeliveryPointRepositoryImpl implements DeliveryPointRepository {
  private ds = new DeliveryPointDatasource();

  getNearbyDeliveryPoints(query?: string): Promise<DeliveryPoint[]> {
    return this.ds.fetchPoints(query);
  }

  selectDeliveryPoint(id: string): Promise<void> {
    return this.ds.selectPoint(id);
  }

  getPointAvailability(id: string): Promise<DeliveryPoint> {
    return this.ds.fetchPoint(id);
  }

  getEligibilityCycle(): Promise<EligibilityCycle> {
    return this.ds.fetchCycle();
  }
}
