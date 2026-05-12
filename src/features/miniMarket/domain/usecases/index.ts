import type { MiniMarketRepository } from "../repositories/MiniMarketRepository";
import type { FoodPackage, Category, PickupInfo } from "../entities";

export class GetFoodPackage {
  constructor(private repo: MiniMarketRepository) {}
  async execute(): Promise<FoodPackage> {
    return this.repo.getFoodPackage();
  }
}

export class GetCategories {
  constructor(private repo: MiniMarketRepository) {}
  async execute(): Promise<Category[]> {
    return this.repo.getCategories();
  }
}

export class GetPickupInfo {
  constructor(private repo: MiniMarketRepository) {}
  async execute(): Promise<PickupInfo> {
    return this.repo.getPickupInfo();
  }
}
