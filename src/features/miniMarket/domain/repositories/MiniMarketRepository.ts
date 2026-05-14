import type { FoodPackage, Category, PickupInfo } from "../entities";

export interface MiniMarketRepository {
  getFoodPackage(): Promise<FoodPackage>;
  getCategories(): Promise<Category[]>;
  getPickupInfo(): Promise<PickupInfo>;
}
