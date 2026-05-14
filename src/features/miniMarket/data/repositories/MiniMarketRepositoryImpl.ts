import type { MiniMarketRepository } from "../../domain/repositories/MiniMarketRepository";
import type { FoodPackage, Category, PickupInfo } from "../../domain/entities";
import { MiniMarketDatasource } from "../datasources/MiniMarketDatasource";

export class MiniMarketRepositoryImpl implements MiniMarketRepository {
  private ds = new MiniMarketDatasource();

  getFoodPackage(): Promise<FoodPackage> { return this.ds.fetchPackage(); }
  getCategories(): Promise<Category[]> { return this.ds.fetchCategories(); }
  getPickupInfo(): Promise<PickupInfo> { return this.ds.fetchPickupInfo(); }
}
