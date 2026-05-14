import type { DeliveryRepository } from "../../domain/repositories/DeliveryRepository";
import type { Delivery, DeliveryStep, EligibilityCycle } from "../../domain/entities";
import { DeliveryRemoteDatasource } from "../datasources/DeliveryRemoteDatasource";

export class DeliveryRepositoryImpl implements DeliveryRepository {
  private datasource: DeliveryRemoteDatasource;

  constructor() {
    this.datasource = new DeliveryRemoteDatasource();
  }

  async getDeliveryStatus(trackingNumber: string): Promise<Delivery> {
    return this.datasource.getDelivery(trackingNumber);
  }

  async getDeliveryTimeline(trackingNumber: string): Promise<DeliveryStep[]> {
    return this.datasource.getTimeline(trackingNumber);
  }

  async getEligibilityCycle(): Promise<EligibilityCycle> {
    return this.datasource.getEligibility();
  }
}
